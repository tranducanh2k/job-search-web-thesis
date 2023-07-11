import mongoose from "mongoose";
const Schema = mongoose.Schema;

const certSchema = new Schema({
    certName: {
        type: String,
        required: true
    }
});

export default mongoose.model('Cert', certSchema);