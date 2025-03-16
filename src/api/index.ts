import { Router } from "express";
import questionRouter from "./question/question.router";

const router = Router();

router.use("/question", questionRouter);

export default router;
