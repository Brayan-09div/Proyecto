import mongoose from 'mongoose';

const binnaclesSchema = new mongoose.Schema({
    register: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', required: true },
    instructor: {
        idinstructor: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String }
    },
    number: {
        type: Number,
        required: true
    },
    document: {
        type: String,
        required: true,
        maxlength: 50
    },
    status: {
        type: String,
        required: true,
        default: '1'
    },
    observation: [{
        user: { type: mongoose.Schema.Types.ObjectId },
        observation: { type: String },
        observationDate: { type: Date, default: Date.now }
    }],
    checkTechnicalInstructor: {
        type: Boolean,
        default: false
    },
    checkProjectInstructor: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Binnacles', binnaclesSchema);



