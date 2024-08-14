import mongoose from 'mongoose';

const modalitySchema = new mongoose.Schema({
    name: { type: String, required: true},
    hourInstructorFollow: { type: Number, required: true },
    hourInstructorTechnical: { type: Number, required: true },
    hourInstructorProject: { type: Number, required: true },
    estado: { type: Number, required: true, default: 1 }
}, { timestamps: true });

export default mongoose.model("Modality", modalitySchema);