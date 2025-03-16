import { Request, Response } from "express";
import { handleGetQuestion } from "./question.service";

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const question = await handleGetQuestion();
    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    res.json(question);
  } catch (error) {
    console.error("Error getting question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
