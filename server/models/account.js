import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { ACCOUNT_TYPE } from "../utils/enum.js";

const accountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 100
    },
    accountType: {
        type: String,
        enum: [ACCOUNT_TYPE.EMPLOYEE, ACCOUNT_TYPE.COMPANY, 'admin'],
        default: ACCOUNT_TYPE.EMPLOYEE
    }
});

export default mongoose.model('Account', accountSchema);