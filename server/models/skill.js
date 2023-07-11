import mongoose from "mongoose";
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    skillName: {
        type: String,
        required: true
    }
});

export default mongoose.model('Skill', skillSchema);