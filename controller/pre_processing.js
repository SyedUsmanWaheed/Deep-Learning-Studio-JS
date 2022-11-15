import joi from "joi"
import dfd from "danfojs-node";
import fs from 'fs';
import { generateGetURL, upload_to_s3 } from "../helper/s3.js";
import { getOne } from "../services/CRUD.js";
import { Project } from "../models/project.js";

export let filter_data = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        project_id: joi.string().required(),
        drop_rows_with_null: joi.boolean().required(),
        include_column: joi.array().items(joi.object().keys({
            name: joi.string().required(),
            include: joi.boolean().required()
        }))
    })
    let { error, value } = validation_schema.validate(req.body)
    if (error) {
        return res.json({ error: true, info: error.message })
    }

    try {
        let { project_id, drop_rows_with_null, include_column } = req.body

        let project = await getOne(Project, {_id: project_id} )
        if(!project){
            return res.json({error:true, info: "project not found"})
        }
        let start_time = Date.now()
        let key = project.dataset_key
        console.log(Date.now()-start_time, "AFTER GET PROJECT AND KEY")
        let df = await dfd.readCSV(await generateGetURL(key))
        console.log(Date.now()-start_time, "AFTER GENERATE GET URL")
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
        console.log(Date.now()-start_time, "AFTER NAME AND LENGTH CHECKS FOR THE DATAFRAME AND INPUT")
        let columns_to_drop = include_column.filter(data => !data.include).map(column => column.name)
        df.drop({ columns: columns_to_drop, inplace: true });
        console.log(Date.now()-start_time, "AFTER DROPING SELECTED COLUMNS")
        if (drop_rows_with_null) {
            df.dropNa({ axis: 0 })
        }
        console.log(Date.now()-start_time, "AFTER DROPING ROWS")
        const csv = dfd.toCSV(df, { filePath: `preprocessed${project_id}.csv`, download: true})
        // console.log(csv)
        await upload_to_s3(`preprocessed${project_id}.csv`, `preprocessed${key}`)
        console.log(Date.now()-start_time, "AFTER UPLOADING FILES TO S3 BUCKET" )
        fs.unlink(`preprocessed${project_id}.csv`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
        return res.json({ error: false, info: "Seleceted Preprocessing options have been applied to the dataset", data: dfd.toJSON(df) })

    }
    catch (err) {
        return res.json({ error: true, info: err.message })
    }

}