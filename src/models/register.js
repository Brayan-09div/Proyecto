import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
    idApprentice: { type: mongoose.Schema.Types.ObjectId, ref: 'Apprentices'},
    idModality: { type: mongoose.Schema.Types.ObjectId, ref: 'Modality'},
    startDate: { type: String },
    endDate: { type: String },
    company: { type: String },
    phoneCompany: { type: String },
    addressCompany: { type: String },
    owner: { type: String },
    docAlternative: { type: String },
    hour : { type: Number,  default : 0},
    businessProyectHour: { type: Number, default: 0 },
    productiveProjectHour: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    mailCompany :{ type: String },
}, { timestamps: true });

export default mongoose.model("Register", registerSchema);
 