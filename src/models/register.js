import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
    idApprentice: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Apprentices' }],
    idModality: { type: mongoose.Schema.Types.ObjectId, ref: 'Modality' },
    startDate: { type: Date },
    endDate: { type: Date },
    company: { type: String },
    phoneCompany: { type: String },
    addressCompany: { type: String },
    mailCompany: { type: String },
    owner: { type: String },
    docAlternative: { type: String },
    certificationDoc: { type: String },
    judymentPhoto: { type: String },

    hourProductiveStageApprentice:{ type: Number},
    
    hourFollowupExcuted: [{ 
        idInstructor: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        hour: { type: Number },
    }],
    businessProyectHourExcuted:[{
        idInstructor: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        hour: { type: Number },
    }],
    productiveProjectHourExcuted:[{
        idInstructor: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        hour: { type: Number },
    }],
    hourFollowupPending: [{
        idInstructor: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        hour: { type: Number },
    }],
    technicalHourPending: [{
        idInstructor: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        hour: { type: Number },
    }],
    ProyectHourPending: [{
        idInstructor: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        hour: { type: Number },
    }],
    assignment: [{
        followUpInstructor: {
            idInstructor: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String },
            email: { type: String },
            status: { type: Number }
        },
        technicalInstructor: {
            idInstructor: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String },
            email: { type: String },
            status: { type: Number }
        },
        projectInstructor: {
            idInstructor: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String },
            email: { type: String },
            status: { type: Number }
        },
        status: { type: Number }
    }],
    status: { type: Number, default: 1 }
    
}, { timestamps: true });
export default mongoose.model("Register", registerSchema);
