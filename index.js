import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import 'dotenv/config'

import user from "./routes/user.js"
import project from "./routes/project.js"
import tags from "./routes/tags.js "
import s3 from "./routes/s3.js"
import preprocessing from "./routes/pre_processing.js"
import visualization from "./routes/visualization.js"

const app = express()
app.use(bodyParser.json())

try{
    mongoose.connect(process.env.MONGOURL)
    console.log("db connected")
} catch(err) {
    console.log(err)
}
app.use("/user", user)
app.use("/project", project)
app.use("/tag", tags)
app.use("/s3", s3)
app.use("/preprocessing", preprocessing)
app.use("/visualization", visualization)

let server = app.listen(process.env.APPPORT, () => {
    console.log("server good");
 })