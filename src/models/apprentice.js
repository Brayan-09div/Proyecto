
import mongoose from 'mongoose';

const apprenticeSchema = new mongoose.Schema({
    fiche:{ type: mongoose.Schema.Types.ObjectId, ref: 'fiche' },
    tpdocument: {type:String, require:true},
    numdocument: {type: String, require:true, unique:true },
    firname: {type:String, require:true, max:50},
    lasname:{type:String,  require:true, max:50},
    phone:{type:String, require:true, max:10},
    email:{type:String, require:true, unique:true},
    status:{type:Number, require:true, default:1}
},{timestamps:true})

export default mongoose.model("Apprentice", apprenticeShema);