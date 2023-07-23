import mongoose from "mongoose";
const Schema = mongoose.Schema;

const interviewSchema = new Schema({
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
    acceptedJobsList: [{
        type: mongoose.ObjectId,
        ref: "Job"
    }],
    interviewDate: {
        type: Date
    },
});

export default mongoose.model('Interview', interviewSchema);