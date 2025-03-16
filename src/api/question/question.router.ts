import { Router } from "express";
import { getQuestion } from "./question.controller";

const router = Router();

router.get("/", getQuestion);

export default router;
