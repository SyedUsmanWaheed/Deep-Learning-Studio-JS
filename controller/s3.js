import joi from "joi";
import { v4 as uuidv4 } from "uuid"
import { generatePutURL } from "../helper/s3.js";


export let signed_url = async (req, res) => {
    let validation_schema = joi.object().keys({
        dataset: joi.string().required()
    })
    let { error, value } = validation_schema.validate(req.body)
    
    if (error) {
        return res.json({ error: true, info: error.message })
    }
    try {

        let { dataset } = req.body

        let key = req.user.user_id + dataset + uuidv4()

        let url = await generatePutURL(key)


        return res.json({ error: false, info: "URL", data: { url, key } })

    } catch (err) {

        console.log(err)
        return res.json({ error: true, info: "failed to get url" });

    }
}