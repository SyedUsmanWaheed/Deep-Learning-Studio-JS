import { Router } from "express"
import { filter_data } from "../controller/pre_processing.js";
import { isUserAuthorized } from "../middleware/authentication.js";

const router = Router()

router.post("/filterdata", isUserAuthorized, filter_data)

export default router;