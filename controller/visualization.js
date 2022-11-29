import { Project } from "../models/project.js"
import joi from "joi"
import dfd from "danfojs-node";
import { getOne } from "../services/CRUD.js";
import { generateGetURL } from "../helper/s3.js";


export let visualization = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        project_id: joi.string().required()
    })
    let { error, value } = validation_schema.validate(req.body)
    if (error) {
        return res.json({ error: true, info: error.message })
    }
    try {
        let { project_id } = req.body
        let project = await getOne(Project, { _id: project_id })
        if (!project) {
            return res.json({ error: false, info: "Project not Found " })
        }

        let preprocessed_dataset = await generateGetURL(project.dataset_key)

        res.json({error: false, info: "Graph", preprocessed_dataset_url :  preprocessed_dataset })


    } catch (err) {
        console.log(err)
        return res.json({ error: true, info: err.message })
    }
}