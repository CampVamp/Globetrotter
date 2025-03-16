import { Request, Response } from "express";
import { handleGetAnswer } from "./answer.service";

export const getAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId, answer } = req.body;
    console.log("questionId", questionId);
    if (!questionId) {
      res.status(400).json({ error: "Missing questionId parameter" });
      return;
    }
    const correctAnswer = await handleGetAnswer(questionId);
    if (!correctAnswer) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    if (correctAnswer.city !== answer) {
      res.json({ isCorrect: false, ...correctAnswer });
      return;
    } else {
      res.json({ isCorrect: true, ...correctAnswer });
      return;
    }
  } catch (error) {
    console.error("Error getting question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
