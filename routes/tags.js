import { Router } from "express";
import { add_tag, search_tag } from "../controller/tags.js";

let router = Router()
router.post("/add", add_tag)
router.get("/search", search_tag)

export default router;