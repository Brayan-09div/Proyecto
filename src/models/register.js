import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
    idApprentice: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Apprentices' 
    }],
    
    idModality: { type: mongoose.Schema.Types.ObjectId, ref: 'Modality' },
    startDate: { type: String },
    endDate: { type: String },
    company: { type: String },
    phoneCompany: { type: String },
    addressCompany: { type: String },
    owner: { type: String },
    docAlternative: { type: String },
    hour: { type: Number, default: 0 },

    businessProyectHour: { type: Number, default: 0 },
    productiveProjectHour: { type: Number, default: 0 },
    
    status: { type: Number, default: 1 },
    mailCompany: { type: String },
    certificationDoc: { type: String },
    judymentPhoto: { type: String },

    assignment: {
        followUpInstructor: {
            idInstructor: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String }
        },
        technicalInstructor: {
            idInstructor: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String }
        },
        projectInstructor: {
            idInstructor: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String }
        },
        status: { type: Number }
    }

}, { timestamps: true });

export default mongoose.model("Register", registerSchema);
