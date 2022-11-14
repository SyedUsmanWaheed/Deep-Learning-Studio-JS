import joi from "joi";
import { generateGetURL } from "../helper/s3.js";
import { Project } from "../models/project.js";
import { add, getList, getOne, updateData } from "../services/CRUD.js";
import dfd from "danfojs-node";
import { Pre_processing } from "../models/pre_processing.js";

export let add_project = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        name: joi.string().required(),
        type: joi.string().required(),
        description: joi.string().required(),
        tags: joi.array().items(joi.string())
    })
    let { error, value } = validation_schema.validate(req.body)
    if (error) {
        console.log(error)
        return res.json({ error: true, info: error.message })
    }

    try {
        let { name, type, description, tags } = req.body
        await Promise.all([
            add(Project, { name, type, description, tags }),
            updateData(Project, { name }, { owner: req.user.user_id })
        ])

        return res.json({ error: false, info: "project successfully added" })
    } catch (err) {
        console.log(err)
        res.json({ error: true, info: err.message })
    }
}

export let get_project_list = async (req, res, next) => {
    try {
        let list = await getList(Project, { owner: req.user.user_id }, { name: 1, type: 1, owner: 1 })
        if (list.length == 0) {
            return res.json({ error: false, info: "No Projects Found", data: list })
        }
        return res.json({ error: false, info: "Projects Found", data: list })

    } catch (err) {
        console.log(err)
        res.json({ error: true, info: err.message })
    }
}

export let save_dataset_key = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        project_id: joi.string().required(),
        key: joi.string().required()
    })

    let { error, value } = validation_schema.validate(req.body)

    if (error) {
        console.log(error)
        return res.json({ error: true, info: error.message })
    }
    try {
        let { project_id, key } = req.body
        let project = await getOne(Project, { _id: project_id })
        if (!project) {
            return res.json({ error: true, info: "Project not found" })
        }

        let df = await dfd.readCSV(await generateGetURL(key))

        let columns_data = df.ctypes

        let stats = columns_data.$index.map((column_name, idx) => {
            if (columns_data.$data[idx] === 'string') {
                let labels = df.column(column_name).valueCounts()
                labels = labels.$index.map((label, idx) => ({
                    name: label, count: labels.$data[idx]
                }))
                return {
                    name: column_name,
                    stats: {
                        labels,
                    },
                    info: {
                        type: "String",
                        unique: df.column(column_name).nUnique(),
                        missing: df.column(column_name).isNa().sum(),
                    }

                }
            } else {
                return {
                    name: column_name,
                    stats: {
                        maximum: df.column(column_name).max(),
                        minimum: df.column(column_name).min(),
                        mean: df.column(column_name).mean(),
                        standard_deviation: df.column(column_name).std()
                    },
                    info: {
                        type: "Numerical",
                        missing: df.column(column_name).isNa().sum(),
                        unique: df.column(column_name).nUnique(),
                    }

                }
            }

        })

        await updateData(Project, { _id: project_id }, { dataset_key: key })

        let dataset_exists = await getOne(Pre_processing, { project: project_id })

        if (!dataset_exists) {
            await add(Pre_processing, { project: project_id, pre_processed_data: stats })
        }
        await updateData(Pre_processing, { project: project_id }, { $set: { pre_processed_data: stats } })

        return res.json({ error: false, info: "key saved", stats })

    } catch (err) {
        console.log(err)
    }
}

export let get_url_from_key = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        key: joi.string().required()
    })

    let { error, value } = validation_schema.validate(req.body)

    if (error) {
        console.log(error)
        return res.json({ error: true, info: error.message })
    }
    try {
        let { key } = req.body

        let url = await generateGetURL(key)
        return res.json({ error: false, info: "URL Reterived", url: url })

    } catch (err) {
        console.log(err)
    }
}