import mongoose from 'mongoose'

const binnaclesShema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
    number: {type: Number, require:true , unique:true, max:10},
    document: {type:String, require:true, unique:true, max:50},
    number: {type: Number, required: true, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]},
    status:{type:String, require:true, default:1},
    observation: [{
        observation: String,
        observationOwner: String,
        observationDate: { type: Date, default: Date.now }
    }],
    users:{type:String, require:true},
},{timestamps:true})

export default mongoose.model("Binnacles", binnaclesShema);      