import { Request, Response } from "express";
import { handleGetUserFromUsername, handleCreateUser } from "./user.service";

export const getUserFromUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await handleGetUserFromUsername(username);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, highScore } = req.body;
    if (!username || !highScore) {
      res.status(400).json({ error: "Missing parameters" });
      return;
    }

    const user = await handleGetUserFromUsername(username);
    if (!user) {
      const newUser = await handleCreateUser(username, highScore);
      res.json(newUser);
      return;
    }

    if (highScore > user.highScore) {
      const updatedUser = await handleCreateUser(username, highScore);
      res.json(updatedUser);
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
