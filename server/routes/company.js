import express from "express";
import isAuth from "../middlewares/verifyToken.js";
import { createOrUpdateCompany } from "../controllers/company.js";

const companyRouter = express.Router();

companyRouter.post("/create-or-update-company", createOrUpdateCompany);

export default companyRouter;
