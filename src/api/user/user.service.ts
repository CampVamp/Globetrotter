import db from "../../config/database";

export const handleGetUserFromUsername = async (username: string) => {
  const collection = db.collection("users");
  const user = await collection.findOne({ username });
  return user;
};

export const handleCreateUser = async (username: string, highScore: number) => {
  const collection = db.collection("users");
  const newUser = await collection.insertOne({ username, highScore });
  return newUser;
};
