import mongoose from "mongoose";
const Schema = mongoose.Schema;

const positionSchema = new Schema({
    positionName: {
        type: String,
        required: true
    }
});

export default mongoose.model('Position', positionSchema);