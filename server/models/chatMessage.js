import mongoose from "mongoose";
const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
    interviewId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Interview"
    },
    senderId: {
        type: mongoose.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ChatMessage', chatMessageSchema);