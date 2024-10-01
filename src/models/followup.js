import mongoose from 'mongoose';

const followupSchema = new mongoose.Schema({
    assignment: {type:mongoose.Schema.Types.ObjectId, ref: 'assignment'},
    instructor: {
        idinstructor: mongoose.Schema.Types.ObjectId,
        name: String
    },
    number: { type: Number, required: true, enum: [1, 2, 3] },
    month: {type:String,  require:true},
    document: {type:String, require:true},
    status:{type:Number , require:true, default:1 },
    users:{type:String , require:true},
    observation: [{
        observation: String,
        user: {type:mongoose.Schema.Types.ObjectId, ref: 'userEP'},
        observationDate: { type: Date, default: Date.now }
    }],
},{timestamps:true}) 

export default mongoose.model("Followup", followupSchema);