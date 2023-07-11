import mongoose from "mongoose";
const Schema = mongoose.Schema;

const companySchema = new Schema({
    accountId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Account"
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    province: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    companySize: {
        type: String,
        required: true,
        enum: [COMPANY_SIZE.SIZE1, COMPANY_SIZE.SIZE2, COMPANY_SIZE.SIZE3, COMPANY_SIZE.SIZE4,
            COMPANY_SIZE.SIZE5, COMPANY_SIZE.SIZE6, COMPANY_SIZE.SIZE7],
    },
    industry: [String],
    
});

export default mongoose.model('Company', companySchema);