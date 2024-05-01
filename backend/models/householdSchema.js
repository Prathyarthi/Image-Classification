import mongoose, { Schema } from "mongoose";

const householdSchema = new Schema({
    appliance: {
        type: String,
        required: true,
        unique: true
    },
    waterfootprintPerDay: {
        type: Number,
        required: true
    }
});

const Household = mongoose.model("Household", householdSchema);
export default Household