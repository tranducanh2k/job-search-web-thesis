import express from "express";
import { login, register } from "../controllers/account.js";

const accountRouter = express.Router();

accountRouter.post("/login", login);
accountRouter.post("/register", register);

export default accountRouter;
