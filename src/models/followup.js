import mongoose from 'mongoose';

const followupSchema = new mongoose.Schema({
    assignment: {type:mongoose.Schema.Types.ObjectId, ref: 'assignment'},
    instructor: {type:mongoose.Schema.Types.ObjectId, ref: 'instructor'},
    number: {type:Number, require:true},
    month: {type:String,  require:true},
    document: {type:String, require:true},
    status:{type:Number, require:true, default:1},
    users:{type:String, require:true},
    observations:{type:String, require:true}
},{timestamps:true}) 

export default mongoose.model("Followup", followupSchema);