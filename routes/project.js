import { Router } from "express";
import { add_project, get_project_list, get_url_from_key, save_dataset_key } from "../controller/project.js";
import { isUserAuthorized } from "../middleware/authentication.js"

const router = Router()

router.post("/add",isUserAuthorized, add_project)
router.get("/list", isUserAuthorized, get_project_list)
router.post("/addkey", isUserAuthorized, save_dataset_key)
router.get("/geturl", isUserAuthorized, get_url_from_key)

export default router;