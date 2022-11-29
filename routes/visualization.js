import { Router } from "express"
import { visualization } from "../controller/visualization.js"
import { isUserAuthorized } from "../middleware/authentication.js"

const router = Router()

router.post("/", isUserAuthorized, visualization)

export default router