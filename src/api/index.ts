import { Router } from "express";
import questionRouter from "./question/question.router";
import answerRouter from "./answers/answer.router";
import userRouter from "./user/user.router";

const router = Router();

router.use("/question", questionRouter);
router.use("/answer", answerRouter);
router.use("/user", userRouter);

export default router;
