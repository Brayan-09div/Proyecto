
import mongoose from 'mongoose';

const apprenticeSchema = new mongoose.Schema({
    fiche: { idFiche: mongoose.Schema.Types.ObjectId, name: String, number: String },
    tpDocument: { type: String, required: true },
    numDocument: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: Number, required: true, default: 1 },
}, { timestamps: true })


export default mongoose.model("Apprentice", apprenticeSchema);