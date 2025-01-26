
const mongoose = require("mongoose");

const callLogSchema = mongoose.Schema({
    leadName: String,
    pocId: String,
    dateTime: 
    {
        type: Date, 
        // min: [Date.now, 'A date cannot be less than current date']
    },
    agenda: 
    {
        type: String,
        required: [true, 'A call must have an agenda'],
        trim: true
    },
    comments: String
})

const CallLog = mongoose.model('CallLog', callLogSchema)

module.exports = CallLog;

