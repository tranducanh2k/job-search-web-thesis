import jwt from "jsonwebtoken";
import { Account } from "../models/index.js";

const isAuth = async (req, res, next) => {
	// check if token is valid
	if (!req.get("authorization")) {
		return res.status(400).json({
            success: false,
			message: "Bad Request",
		});
	}

    let token = req.get("authorization").split(" ")[1];

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_JWT);
            await Account.findOne({username: decoded.username}).select('-password');
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            })
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

export default isAuth;
