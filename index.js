import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import 'dotenv/config'

import user from "./routes/user.js"
import project from "./routes/project.js"
import tags from "./routes/tags.js "

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

let server = app.listen(process.env.APPPORT, () => {
    console.log("server good");
 })