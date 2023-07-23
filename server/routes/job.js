import express from "express";
import { getJobById, getJobsByPage } from "../controllers/job.js";

const jobRouter = express.Router();

jobRouter.get("/get-by-id/:id", getJobById);
jobRouter.get("/get-jobs-by-page", getJobsByPage);

export default jobRouter;
