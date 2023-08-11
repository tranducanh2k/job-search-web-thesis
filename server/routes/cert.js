import express from "express";
import { getAllCert } from "../controllers/cert.js";

const certRouter = express.Router();

certRouter.get("/", getAllCert);

export default certRouter;
