import { Router } from "express";
import { signed_url } from "../controller/s3.js";

let router = Router()
router.post("/signurl", signed_url)

export default router;