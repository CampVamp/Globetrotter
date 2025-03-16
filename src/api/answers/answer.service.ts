import db from "../../config/database";
import { ObjectId } from "mongodb";

export const handleGetAnswer = async (questionId: string) => {
  const collection = db.collection("answers");

  const answer = await collection.findOne({
    question_id: new ObjectId(questionId),
  });
  return answer;
};
