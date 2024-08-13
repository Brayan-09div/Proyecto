import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
    apprentice: {type:mongoose.Schema.Types.ObjectId, ref: 'apprentice'},
    modality: {type:mongoose.Schema.Types.ObjectId, ref: 'modality'},
    startDate: {type:Date, require:true},
    endDate: {type:Date,  require:true},
    company: {type:String, require:true},
    phonecompany:{type:String, require:true},
    addresscompany:{type:String, require:true},
    owner:{type:String, require:true},
    docalternative:{type:String, require:true},
    hour:{type:Number, require:true},
},{timestamps:true})

export default mongoose.model("Register", registerSchema);
 