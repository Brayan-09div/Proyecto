import mongoose from 'mongoose'

const apprenticeShema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    number: {type:number, require:true , unique:true, max:10},
    document: {type:String, require:true, unique:true, max:50},
    status:{type:String, require:true, default:1},
    observation:{type:String, require:true},
    users:{type:String, require:true},
    status:{type:Number, require:true, default:1}
},{timestamps:true})

export default mongoose.model("Binnacles", apprenticeShema);