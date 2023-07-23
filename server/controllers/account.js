import bcryptjs from "bcryptjs";
import { Account, Company, Employee } from "../models/index.js";
import jwt from 'jsonwebtoken';

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
			const token = jwt.sign({ username }, process.env.SECRET_JWT, {
				expiresIn: '1d',
			});
			let employee = await Employee.findOne({accountId: existUser._id});
			let company = await Company.findOne({accountId: existUser._id});

			res.status(200).json({
				message: "Login successful",
				user: {
					username: existUser.username,
					accountType: existUser.accountType,
					accountId: existUser._id,
				},
				token: token,
				employeeId: employee? employee._id : '',
				companyId: company? company._id : ''
			});
		}
	} catch (error) {
		console.log(error)
		res.status(404).json({
			message: error
		});
	}
}

//[POST] /account/register
export async function register(req, res) {
	const { username, password, accountType } = req.body;
	let reponseBody = {
		username: username,
		accountType: accountType
	}
	try {
		const existUser = await Account.findOne({ username });
		if (existUser) {
			return res.status(404).json({
				...reponseBody,
				message: "Username has already existed",
			});
		}

		const hashPassword = await bcryptjs.hash(password, 12);

		const newUser = await Account.create({
			username: username,
			password: hashPassword,
			accountType: accountType
		});
		if(newUser) {
			res.status(200).json({
				...reponseBody,
				message: "Create New User Successfully",
				accountId: newUser._id
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
			message: error
		});
	}
}