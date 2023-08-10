import express from "express";
import { getJobById, getJobsByPage, getJobsByCompanyId, createOrUpdateJob, deleteJob, getAllJob, search } from "../controllers/job.js";
import isAuth from '../middlewares/verifyToken.js';

const jobRouter = express.Router();

jobRouter.get("/get-by-id/:id", getJobById);
jobRouter.get("/get-by-company-id/:id", getJobsByCompanyId);
jobRouter.get("/get-jobs-by-page", getJobsByPage);
jobRouter.get("/get-all", getAllJob);
jobRouter.post("/search", search);
jobRouter.post("/create-or-update/:id", isAuth, createOrUpdateJob);
jobRouter.delete("/delete/:id", isAuth, deleteJob);

export default jobRouter;
