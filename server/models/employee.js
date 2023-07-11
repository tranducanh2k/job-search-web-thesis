import mongoose from "mongoose";
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    accountId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Account"
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
    },
    education: [{
        schoolName: String,
        field: String,
        schoolYearIn: Number,
        schoolYearOut: Number
    }],
    experience: [{
        companyName: String,
        position: String,
        seniority: Number,
        description: String
    }],
    skill: [String],
    certificate: [{
        certName: String,
        description: String,
        image: String
    }],
    product: [{
        link: String,
        description: String
    }],
    cv: {
        type: String
    },
    jobsFollowing: [{type: mongoose.ObjectId, ref: "Job"}],
    avatar: {
        type: String
    }
});

export default mongoose.model('Employee', employeeSchema);