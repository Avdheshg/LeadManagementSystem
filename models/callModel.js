
const mongoose = require("mongoose");

const callLogSchema = mongoose.Schema({
    leadId: String,
    pocId: String,
    dateTime: 
    {
        type: Date, 
        min: [Date.now, 'A date cannot be less than current date']
    },
    agenda: 
    {
        type: String,
        required: [true, 'A call must have an agenda'],
        trim: true
    },
    comments: String
})

const CallLog = mongoose.model('Call', callLogSchema)

module.exports = Call;

