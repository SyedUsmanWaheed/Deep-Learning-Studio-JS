import { Router } from "express";
import { add_project, get_project_list } from "../controller/project.js";
import { isUserAuthorized } from "../middleware/authentication.js"

const router = Router()

router.post("/add", add_project)
router.get("/list", isUserAuthorized, get_project_list)

export default router;