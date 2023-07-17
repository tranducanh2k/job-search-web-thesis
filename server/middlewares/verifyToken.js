import jwt from "jsonwebtoken";
import { Account } from "../models";

const isAuth = async (req, res, next) => {
	// check if token is valid
	if (!req.get("authorization")) {
		return res.json({
            success: false,
			message: "Bad Request",
		});
	}

    let token = req.get("authorization").split(" ")[1];

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_JWT);
            req.user = await Account.findOne({username: decoded.username}).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            })
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

export default isAuth;
