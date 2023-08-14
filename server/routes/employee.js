import express from "express";
import { adminDelete, createOrUpdateEmployee, getAll, getByAccountId,getByEmployeeId, search } from "../controllers/employee.js";
import isAuth from "../middlewares/verifyToken.js";

const employeeRouter = express.Router();

employeeRouter.get("/", getAll);
employeeRouter.get("/get-by-id", getByAccountId);
employeeRouter.get("/get-by-employee-id/:id", getByEmployeeId);
employeeRouter.post("/create-or-update-employee", isAuth, createOrUpdateEmployee);
employeeRouter.post("/search", search);
employeeRouter.delete('/admin-delete/:id', adminDelete)

export default employeeRouter;
