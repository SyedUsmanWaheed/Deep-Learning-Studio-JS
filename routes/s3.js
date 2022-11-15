import { Router } from "express";
import { signed_url } from "../controller/s3.js";
import { isUserAuthorized } from "../middleware/authentication.js";

let router = Router()
router.post("/signurl", isUserAuthorized, signed_url)

export default router;