import express from "express";
import isAuth from "../middlewares/verifyToken.js";
import { createOrUpdateInterview, getByCompanyEmployee } from "../controllers/chat.js";

const chatRouter = express.Router();

chatRouter.post("/get-by-company-employee", isAuth, getByCompanyEmployee);
chatRouter.post("/create-or-update", isAuth, createOrUpdateInterview);
chatRouter.post("/add-message", isAuth);

export default chatRouter;
