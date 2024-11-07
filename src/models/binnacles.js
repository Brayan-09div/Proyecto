import mongoose from 'mongoose'

const binnaclesShema = new mongoose.Schema({
    register: {type:mongoose.Schema.Types.ObjectId, ref: 'register'},
    instructor: { 
        idinstructor: mongoose.Schema.Types.ObjectId, 
        name: String
     },
    number: {type: Number, require:true , unique:true, max:10},
    document: {type:String, require:true, unique:true, max:50},
    number: {type: Number, required: true, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]},
    status:{type:String, require:true, default:1},
    observation: [{
        user: { type: mongoose.Schema.Types.ObjectId },
        observation: String,
        observationDate: { type: Date, default: Date.now }
    }],
},{timestamps:true})

export default mongoose.model("Binnacles", binnaclesShema);     


