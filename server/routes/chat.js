import express from "express";
import isAuth from "../middlewares/verifyToken.js";
import { addMessage,getAll, createOrUpdateInterview, getByCompanyEmployee, getInterviewById, adminDelete } from "../controllers/chat.js";

const chatRouter = express.Router();

chatRouter.get("/", getAll);
chatRouter.get("/get-interview-by-id/:id", isAuth, getInterviewById);
chatRouter.post("/get-by-company-employee", isAuth, getByCompanyEmployee);
chatRouter.post("/create-or-update", isAuth, createOrUpdateInterview);
chatRouter.post("/add-message", isAuth, addMessage);
chatRouter.delete('/admin-delete/:id', adminDelete)

export default chatRouter;
