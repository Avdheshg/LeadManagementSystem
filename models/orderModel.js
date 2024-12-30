
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    leadName: String,
    name: 
    {
        type: String,
        required: [true, 'A order must have a name'],
        unique: true,
    },
    category: 
    {
        type: String,
        default: "Kitchen applicances",
        enum: ["Clothing", "Electronics", "Kitchen applicances"]
    },
    count: 
    {
        type: Number,
        default: 1,
        min: [1, "Order count must be atleast 1"]
    },
    dateTime: 
    {
        type: Date,
        min: [Date.now, 'A date cannot be less than current date']
    },
    details: String
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;



 