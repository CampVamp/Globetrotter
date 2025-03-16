import { Router } from "express";
import { getUserFromUsername, createUser } from "./user.controller";

const router = Router();

router.get("/:username", getUserFromUsername);
router.post("/", createUser);

export default router;
