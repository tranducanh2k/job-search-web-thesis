import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { JOB_TYPE } from "../utils/enum.js";

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
        enum: [Object.values(JOB_LEVEL)]
    },
    position: {
        type: String,
        required: true
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
        enum: [Object.values(JOB_TYPE)]
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
        type: String,
        required: true
    }
});

export default mongoose.model('Job', jobSchema);