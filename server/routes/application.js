import express from "express";
import { createApplication, getApplicationbyCompany, getApplicationbyEmployee, updateApplicationById } from "../controllers/application.js";
import isAuth from "../middlewares/verifyToken.js";

const applicationRouter = express.Router();

applicationRouter.get("/get-by-employee-id/:id", isAuth, getApplicationbyEmployee);
applicationRouter.get("/get-by-company-id/:id", isAuth, getApplicationbyCompany);
applicationRouter.post("/create", isAuth, createApplication);
applicationRouter.put("/update/:id", isAuth, updateApplicationById);

export default applicationRouter;
