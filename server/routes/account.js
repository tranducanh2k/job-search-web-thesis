import express from "express";
import { createNoti, getNoti, login, register, updatePass } from "../controllers/account.js";

const accountRouter = express.Router();

accountRouter.post("/login", login);
accountRouter.post("/register", register);
accountRouter.post('/update-password', updatePass)
accountRouter.get('/get-noti-by-account-id/:id', getNoti);
accountRouter.post('/create-noti', createNoti);

export default accountRouter;
