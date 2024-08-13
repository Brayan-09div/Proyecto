import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    register: { type: mongoose.Schema.Types.ObjectId, ref: 'Register' },
    instructorfollow: { type: mongoose.Schema.Types.ObjectId, ref: 'InstructorFollow' },
    instructortechnical: { type: mongoose.Schema.Types.ObjectId, ref: 'InstructorTechnical' },
    instructorproject: { type: mongoose.Schema.Types.ObjectId, ref: 'InstructorProject' },
    certificationdoc: { type: String, required: true},
    judymentPhoto: { type: String, required: true },
    observation: { type: String, required: true },
    status:{type:Number, require:true, default:1}
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema)













;