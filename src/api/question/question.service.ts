import db from "../../config/database";

export const handleGetQuestion = async () => {
  const collection = db.collection("questions");
  const count = await collection.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const question = await collection.findOne({}, { skip: randomIndex });
  return question;
};
