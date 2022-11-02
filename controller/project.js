import joi from "joi";
import { Project } from "../models/project.js";
import { add, getList } from "../services/CRUD.js";

export let add_project = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        name: joi.string().required(),
        type: joi.string().required(),
        owner: joi.string().required(),
        description: joi.string().required(),
        tags: joi.array().items(joi.string())
    })
    let { error, value } = validation_schema.validate(req.body)
    if (error) {
        console.log(error)
        return res.json({ error: true, info: error.message })
    }

    try {
        let { name, type, owner, description, tags } = req.body
        let project = await add(Project, { name, type, owner, description, tags })

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