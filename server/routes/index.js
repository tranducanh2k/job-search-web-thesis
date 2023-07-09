import express from "express";
import accountRouter from "./account.js";

const rootRouter = express.Router();

rootRouter.use('/account', accountRouter);

export default rootRouter;