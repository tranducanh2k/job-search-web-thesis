import mongoose from "mongoose";
const Schema = mongoose.Schema;

const recommendDataSchema = new Schema({
    name: {
        type: String
    },
    data: {
        type: String
    }
});

export default mongoose.model('RecommendData', recommendDataSchema);