import express from "express";
import isAuth from "../middlewares/verifyToken.js";
import { create, getByCompanyId, getByEmployeeId, update } from "../controllers/invite.js";

const inviteRouter = express.Router();

inviteRouter.get("/get-by-company-id/:id", getByCompanyId);
inviteRouter.get("/get-by-employee-id/:id", getByEmployeeId);
inviteRouter.post("/create", isAuth, create);
inviteRouter.post("/update", isAuth, update);

export default inviteRouter;
