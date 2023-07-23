import mongoose from "mongoose";
const Schema = mongoose.Schema;
import {APPLICATION_STATUS} from '../utils/enum.js';

const interviewInvitationSchema = new Schema({
    jobId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Account"
    },
    employeeId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Employee"
    },
    companyId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Company"
    },
    invitation: {
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

export default mongoose.model('InterviewInvitation', interviewInvitationSchema);