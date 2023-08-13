import bcryptjs from "bcryptjs";
import { Account, Company, Employee, Notification } from "../models/index.js";
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
			return res.status(404).json({
				message: 'Wrong password'
			})
		} else {
			const token = jwt.sign({ username }, process.env.SECRET_JWT, {
				expiresIn: '1d',
			});
			let employee = await Employee.findOne({accountId: existUser._id});
			let company = await Company.findOne({accountId: existUser._id});

			if(existUser.accountType == 'company' && company.status == 'disabled') {
				return res.status(404).json({
					message: "Company account is not activated"
				})
			}

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

export async function updatePass(req, res) {
	const account = req.body;

	try {
		const existUser = await Account.findOne({ username: account.username });
		if(!existUser) {
			return res.status(404).json({
				message: 'update pass failed'
			})
		} else {
			const hashPassword = await bcryptjs.hash(account.password, 12);
			const updateAcc = await Account.findOneAndUpdate({username: account.username}, {
				password: hashPassword
			})
			return res.status(200).json({
				message: 'Update password successfully'
			})
		}
	} catch (err) {
		console.log(err)
		return res.status(404).json({
			message: 'update pass failed'
		})
	}
}

export async function createNoti(req, res) {
	const noti = req.body;

	try {
		let createNoti = await Notification.create(noti);
		return res.status(200).json({
			message: 'create noti successfully',
			createNoti
		})
	} catch (err) {
		console.log(err)
		return res.status(404).json({
			message: 'create noti failed'
		})
	}
}

export async function getNoti(req, res) {
	const id = req.params.id;

	try {
		let noti = await Notification.find({accountId: id});
		return res.status(200).json({
			message: 'get noti successfully',
			noti
		})
	} catch (err) {
		console.log(err)
		return res.status(404).json({
			message: 'get noti failed'
		})
	}
}