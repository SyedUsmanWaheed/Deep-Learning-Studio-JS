import joi from "joi";
import { Tags } from "../models/tags.js";
import { add, getList } from "../services/CRUD.js";

export let add_tag = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        name: joi.string().required()
    })
    let { error } = validation_schema.validate(req.body)
    if (error) {
        return res.json({ error: true, info: error.message })
    }
    try {
        let { name } = req.body
        await add(Tags, { name })
        return res.json({ error: false, info: "Successfully added" })

    } catch (err) {
        console.log(err)
        res.json({ error: true, info: err.message })
    }
}

export let search_tag = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        search: joi.string().required()
    })
    let { error } = validation_schema.validate(req.body)
    if (error) {
        return res.json({ error: true, info: error.message })
    }
    try {
        let { search } = req.body
        let searched_tags = await getList(Tags, { name: { $regex: ".*" + search + ".*", $options: "i" } }, { name: 1, _id: 0 })
        if (searched_tags == 0) {
            return res.json({ error: false, info: "No Result Found", searched_tags: [] })
        }
        return res.json({ error: false, info: " Tags Found", data: searched_tags })

    } catch (err) {

        console.log(err)
        res.json({ error: true, info: err.message })
    }
}