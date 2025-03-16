import { Router } from "express";
import { getAnswer } from "./answer.controller";

const router = Router();

router.post("/", getAnswer);

export default router;
