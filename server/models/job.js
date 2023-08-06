import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { JOB_TYPE, JOB_LEVEL } from "../utils/enum.js";

const jobSchema = new Schema({
    companyId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Company"
    },
    title: {
        type: String,
        required: true
    },
    requiredExperience: {
        type: Number, //months
        required: true
    },
    jobLevel: {
        type: String,
        required: true,
        enum: [JOB_LEVEL.ALL,JOB_LEVEL.FRESHER,JOB_LEVEL.INTERN,JOB_LEVEL.JUNIOR,JOB_LEVEL.LEADER,JOB_LEVEL.MANAGER,
            JOB_LEVEL.MIDDLE,JOB_LEVEL.SENIOR]
    },
    minSalary: {
        type: Number
    },
    maxSalary: {
        type: Number
    },
    jobType: {
        type: String,
        required: true,
        enum: [JOB_TYPE.HYBRID, JOB_TYPE.IN_OFFICE, JOB_TYPE.OVERSEA, JOB_TYPE.REMOTE]
    },
    fullTime: {
        type: Boolean,
        required: true
    },
    requiredSkill: [{
        type: mongoose.ObjectId,
        required: true,
        ref: "Skill"
    }],
    description: {
        role: String,
        skillRequired: String,
        benefit: String
    }
});

export default mongoose.model('Job', jobSchema);