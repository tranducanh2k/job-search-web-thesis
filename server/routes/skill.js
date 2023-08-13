import express from "express";
import { create, deleteSkill, getSkills } from "../controllers/skill.js";

const skillRouter = express.Router();

skillRouter.get("/", getSkills);
skillRouter.post("/create", create);
skillRouter.delete("/delete/:id", deleteSkill);

export default skillRouter;
