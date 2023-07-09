import mongoose from "mongoose";
const Schema = mongoose.Schema;
// import { ACCOUNT_TYPE } from "../utils/enum.js";

const employeeSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String
    },
    province: {
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    }
});

export default mongoose.model('Account', accountSchema);