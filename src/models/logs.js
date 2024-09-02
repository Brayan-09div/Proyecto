import mongoose from 'mongoose';

const logsSchema = new mongoose.Schema({
    users: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    action: { type: String, required: true }, 
    information: { type: Object, required: true }, 
    status: { type: Number, required: true, default: 1 }
}, { timestamps: true });

export default mongoose.model("Logs", logsSchema);