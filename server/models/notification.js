import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    accountId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "Account"
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Notification', notificationSchema);