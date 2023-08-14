import express from "express";
import isAuth from "../middlewares/verifyToken.js";
import { adminDelete, createOrUpdateCompany, getAll, getById, search } from "../controllers/company.js";

const companyRouter = express.Router();

companyRouter.get('/', getAll);
companyRouter.get("/get-by-id/:id", getById);
companyRouter.post("/create-or-update-company", createOrUpdateCompany);
companyRouter.post("/search", search);
companyRouter.delete('/admin-delete/:id', adminDelete)

export default companyRouter;
