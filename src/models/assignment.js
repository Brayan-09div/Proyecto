import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    register: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', required: true },
    followUpInstructor: {
        idInstructor: mongoose.Schema.Types.ObjectId,
        name: String
    },
    technicalInstructor: {
        idInstructor: mongoose.Schema.Types.ObjectId,
        name: String
    },
    projectInstructor: {
        idInstructor: mongoose.Schema.Types.ObjectId,
        name: String
    },
    certificationDoc: { type: String, required: true },
    judymentPhoto: { type: String, required: true },
    status: { type: Number, required: true }
}, { timestamps: true });


export default mongoose.model('Assignment', assignmentSchema)



























;