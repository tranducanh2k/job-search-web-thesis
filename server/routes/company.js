import express from "express";
import isAuth from "../middlewares/verifyToken.js";
import { createOrUpdateCompany, getAll, getById } from "../controllers/company.js";

const companyRouter = express.Router();

companyRouter.get('/', getAll);
companyRouter.get("/get-by-id/:id", getById);
companyRouter.post("/create-or-update-company", createOrUpdateCompany);

export default companyRouter;
