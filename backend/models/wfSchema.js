import mongoose, { Schema } from "mongoose";

const wfSchema = new Schema({
    product: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    },
    waterfootprint: {
        type: Number,
        required: true
    }
});

const Wf = mongoose.model("Wf", wfSchema);
export default Wf