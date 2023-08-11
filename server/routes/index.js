import express from "express";
import accountRouter from "./account.js";
import employeeRouter from "./employee.js";
import jobRouter from "./job.js";
import isAuth from "../middlewares/verifyToken.js";
import applicationRouter from "./application.js";
import skillRouter from "./skill.js";
import companyRouter from "./company.js";
import chatRouter from "./chat.js";
import certRouter from "./cert.js";

const rootRouter = express.Router();

//check auth route
rootRouter.post('/isAuth', isAuth, (req, res) => {
    return res.status(200).json({
        message: 'Is authorized'
    })
});

rootRouter.use('/account', accountRouter);
rootRouter.use('/employee', employeeRouter);
rootRouter.use('/job', jobRouter);
rootRouter.use('/application', applicationRouter);
rootRouter.use('/skill', skillRouter);
rootRouter.use('/company', companyRouter);
rootRouter.use('/chat', chatRouter);
rootRouter.use('/cert', certRouter)

export default rootRouter;