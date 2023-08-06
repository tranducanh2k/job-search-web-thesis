import express from "express";
import { getJobById, getJobsByPage, getJobsByCompanyId } from "../controllers/job.js";

const jobRouter = express.Router();

jobRouter.get("/get-by-id/:id", getJobById);
jobRouter.get("/get-by-company-id/:id", getJobsByCompanyId);
jobRouter.get("/get-jobs-by-page", getJobsByPage);

export default jobRouter;
