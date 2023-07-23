import express from "express";
import { createOrUpdateEmployee, getById } from "../controllers/employee.js";
import isAuth from "../middlewares/verifyToken.js";

const employeeRouter = express.Router();

employeeRouter.get("/get-by-id", getById);
employeeRouter.post("/create-or-update-employee", isAuth, createOrUpdateEmployee);

export default employeeRouter;
