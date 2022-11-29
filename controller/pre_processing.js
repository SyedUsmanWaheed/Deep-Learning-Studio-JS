import joi from "joi"
import dfd from "danfojs-node";
import fs from 'fs';
import { generateGetURL, upload_to_s3 } from "../helper/s3.js";
import { getOne, updateData } from "../services/CRUD.js";
import { Project } from "../models/project.js";
import { User } from "../models/user.js";

export let filter_data = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        project_id: joi.string().required(),
        drop_rows_with_null: joi.boolean().required(),
        include_column: joi.array().items(joi.object().keys({
            name: joi.string().required(),
            include: joi.boolean().required(),
            impute_with: joi.string().required().allow(""),
            replace_this: joi.string().required().allow(""),
            replace_with: joi.string().required().allow("")
        }))
    })
    let { error, value } = validation_schema.validate(req.body)
    if (error) {
        return res.json({ error: true, info: error.message })
    }

    try {
        let { project_id, drop_rows_with_null, include_column } = req.body

        let project = await getOne(Project, { _id: project_id })
        if (!project) {
            return res.json({ error: true, info: "project not found" })
        }
        let key = project.dataset_key

        let df = await dfd.readCSV(await generateGetURL(key))

        let columns_data = df.ctypes;

        let length_in_input = include_column.length
        let df_length = df.ctypes.$index.length

        if (df_length !== length_in_input) {
            return res.json({ error: true, info: " Your Input does not match the length of dataframe. Enter All the columns" })
        }

        include_column.map((column, idx) => {
            if (column.name != df.ctypes.$index[idx]) {
                return res.json({ error: true, info: "The Names donot match the name of the columns in dataframe" })
            }
        })

        let columns_to_drop = include_column.filter(data => !data.include).map(column => column.name)
        df.drop({ columns: columns_to_drop, inplace: true });
        if (drop_rows_with_null) {
            df.dropNa({ axis: 1, inplace: true })
        }
        else {

            let filler_values = include_column.map((column_obj, idx) => {
                if (df.ctypes.$data[idx] !== 'string') {
                    if (column_obj.impute_with === 'mean') {
                        return df.column(column_obj.name).mean()
                    } else {
                        return df.column(column_obj.name).median()
                    }
                } else {
                    df = df.replace(column_obj.replace_this, column_obj.replace_with, { columns: [column_obj.name] })
                    return column_obj.impute_with
                }
            })

            df = df.fillNa(filler_values, { columns: df.ctypes.$index })
        }
        df.print()

        const csv = dfd.toCSV(df, { filePath: `preprocessed${project_id}.csv`, download: true })


        let uploading = await upload_to_s3(`preprocessed${project_id}.csv`, `preprocessed${key}`)
        console.log(uploading.Key)
        let add_updated_key = await updateData(Project, { _id: project_id }, { dataset_key: uploading.Key })
        
        let preprocessed_dataset = await generateGetURL(uploading.Key)

        fs.unlink(`preprocessed${project_id}.csv`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
        return res.json({ error: false, info: "Seleceted Preprocessing options have been applied to the dataset", preprocessed_dataset_url: preprocessed_dataset })

    }
    catch (err) {
        console.error(err)
        return res.json({ error: true, info: err.message })
    }

}