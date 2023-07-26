import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandling.js";
import rootRouter from "./routes/index.js";
import * as http from "http";
import { initSocket } from "./utils/socket.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

//setup cors
app.options("*", cors());
app.use(cors({
	credentials: true,
	origin: '*'
}));

const server = http.createServer(app);

// middleware to parse info from req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', rootRouter);

// error handler middleware
app.use(errorHandler);

//init chat
initSocket(server);

//connect to DB
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => {
		console.log("Connect to DB successful");
		server.listen(PORT, () => {
			console.log("Server start - " + PORT);
		});
	})
	.catch((err) => {
		console.error("Fail to connect to DB: ", err);
	});
