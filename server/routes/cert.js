import express from "express";
import { getAllCert,create, deleteCert } from "../controllers/cert.js";

const certRouter = express.Router();

certRouter.get("/", getAllCert);
certRouter.post("/create", create);
certRouter.delete("/delete/:id", deleteCert);

export default certRouter;
