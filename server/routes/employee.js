import express from "express";
import { createOrUpdateEmployee, getAll, getByAccountId,getByEmployeeId } from "../controllers/employee.js";
import isAuth from "../middlewares/verifyToken.js";

const employeeRouter = express.Router();

employeeRouter.get("/", getAll);
employeeRouter.get("/get-by-id", getByAccountId);
employeeRouter.get("/get-by-employee-id/:id", getByEmployeeId);
employeeRouter.post("/create-or-update-employee", isAuth, createOrUpdateEmployee);

export default employeeRouter;
