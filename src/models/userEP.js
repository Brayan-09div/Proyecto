import mongoose from 'mongoose';

const userEpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: "" },
    name: { type: String, required: true },
    status: { type: Number, required: true, default: 1 }
}, { timestamps: true });

export default mongoose.model("UsersEp", userEpSchema);