import bcryptjs from "bcryptjs";
import { Account } from "../models/index.js";
import generateToken from "../utils/generateToken.js";

//[POST] /account/login
export const login = async (req, res) => {
	const { username, password } = req.body;

	try {
		//check email exist
		const existUser = await Account.findOne({ username });
		if (!existUser) {
			return res.status(404).json({
				message: "Username doesnt exist"
			});
		}

		//check password
		const passwordVerify = await bcryptjs.compare(
			password,
			existUser.password
		);
		if (!passwordVerify) {
			throw new Error("Wrong password");
		} else {
			generateToken(res, existUser.username);
			
			res.status(200).json({
				message: "Login successful",
				username: existUser.username
			});
		}
	} catch (error) {
		console.log(error)
		res.status(404).json({
			message: error.message
		});
	}
}

//[POST] /account/register
export async function register(req, res) {
	const { username, password, accountType } = req.body;
	let reponseBody = {
		username: username,
		account_type: accountType
	}
	try {
		const existUser = await Account.findOne({ username });
		if (existUser) {
			return res.status(404).json({
				...reponseBody,
				message: "Email has already existed",
			});
		}

		const hashPassword = await bcryptjs.hash(password, 12);

		const newUser = await Account.create({
			username: username,
			password: hashPassword,
			account_type: accountType
		});
		if(newUser) {
			res.status(200).json({
				...reponseBody,
				message: "Create New User Successfully"
			});
		} else {
			res.status(404).json({
				...reponseBody,
				message: "Create New User failed",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			...reponseBody,
			message: error.message
		});
	}
}