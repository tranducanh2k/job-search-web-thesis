import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { APPLICATION_STATUS } from "../utils/enum.js";

const applicationSchema = new Schema({
    employeeId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Employee"
    },
    jobId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Job"
    },
    companyId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Company"
    },
    cv: {
        type: String
    },
    coverLetter: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [APPLICATION_STATUS.ACCEPTED, APPLICATION_STATUS.DECLINED, APPLICATION_STATUS.PENDING]
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Application', applicationSchema);