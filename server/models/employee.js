import mongoose from "mongoose";
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    accountId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Account"
    },
    name: { //
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
    gender: { //
        type: String,
        enum: ['male', 'female']
    },
    address: {
        type: String
    },
    province: {
        type: String
    },
    education: [{
        schoolName: String,
        field: String
    }],
    experience: [{
        companyName: String,
        position: String,
        seniority: String,
        description: String
    }],
    skill: [{
        type: mongoose.ObjectId,
        ref: "Skill"
    }],
    certificate: [{
        certName: String,
        description: String
    }],
    product: [{
        link: String,
        description: String
    }],
    cv: String,
    jobsFollowing: [{type: mongoose.ObjectId, ref: "Job"}],
    avatar: {
        type: String
    }
});

employeeSchema.index({ 
    name: 'text',
    gender: 'text',
    address: 'text',
    province: 'text',
    'education.schoolName': 'text',
    'education.field': 'text',
    'experience.companyName': 'text',
    'certificate.certName': 'text'
});

export default mongoose.model('Employee', employeeSchema);