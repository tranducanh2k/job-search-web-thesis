import express from "express";
import isAuth from "../middlewares/verifyToken.js";
import { addMessage, createOrUpdateInterview, getByCompanyEmployee, getInterviewById } from "../controllers/chat.js";

const chatRouter = express.Router();

chatRouter.get("/get-interview-by-id/:id", isAuth, getInterviewById);
chatRouter.post("/get-by-company-employee", isAuth, getByCompanyEmployee);
chatRouter.post("/create-or-update", isAuth, createOrUpdateInterview);
chatRouter.post("/add-message", isAuth, addMessage);

export default chatRouter;
