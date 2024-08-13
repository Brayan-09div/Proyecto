
const logsSchema = new mongoose.Schema({
    users: { type: String, required: true }, 
    action: { type: String, required: true }, 
    information: { type: Object, required: true }, 
    data: { type: Object, required: true },
    hourInstructorProject: { type: Number, required: true }, 
    estado: { type: Number, required: true, default: 1 }
}, { timestamps: true });

export default mongoose.model("Logs", logsSchema);