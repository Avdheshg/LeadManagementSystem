
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    leadName: String,
    name: 
    {
        type: String,
        unique: true,
    },
    category: 
    {
        type: String,
        default: "Kitchen applicances"
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
        default: Date.now
    },
    details: String
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;



 