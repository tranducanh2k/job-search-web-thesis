import mongoose from "mongoose";
const Schema = mongoose.Schema;

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
    account_type: {
        type: String,
        enum: [ACCOUNT_TYPE.EMPLOYEE, ACCOUNT_TYPE.COMPANY],
        default: ACCOUNT_TYPE.EMPLOYEE
    }
});

export default accountSchema;