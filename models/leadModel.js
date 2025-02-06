
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadName:
    {
        type: String,
        unique: true,
        required: [true, 'A name is required for the lead'],
        trim: true
    },
    address: String,
    leadDate: Date,
    totalOrdersPlaced:  
    {
        type: Number,
        min: [0, "Total orders can't be less than 0"]
    }, 
    leadType : 
    {
        type: String,
        default: "HOT",
        enum: ['HOT', 'WARM', 'COLD'], 
    },
    source: String,
    assignedTo: String,

    pointOfContact:        
    [{
        name:  
        {
            type: String,
            required: [true, 'Point of contact must have a name']
        },
        role: 
        {
            type: String,
            required: [true, 'Point of contact must have a role']
        },
        phone:
        {
            type: Number,
            unique: true,
            required: [true, 'Point of contact must have a phone number']
        },
        email: 
        {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            validate: 
            {
                validator: function (value) {
                  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: 'Invalid email address format',
            }
        }
    }]

});

const Lead = mongoose.model('Lead', leadSchema)   

module.exports = Lead;


/*
Here’s an example of making an HTTP POST request to demonstrate how nested schemas can be utilized when adding a new lead with multiple points of contact, orders, and call details.

### Example: Adding a New Lead
The HTTP POST request will include a payload that aligns with the nested schemas for `pointOfContact`, `order`, and `call`.

#### Express.js Route for Adding a New Lead
```javascript
const express = require('express');
const mongoose = require('mongoose');
const Lead = require('./models/lead'); // Import the Lead model

const app = express();
app.use(express.json());

app.post('/api/leads', async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/leads_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.error('Database connection error:', err));
```

---

#### Sample HTTP Request Using Postman or cURL

**Endpoint**:  
`POST http://localhost:3000/api/leads`

**Request Body**:
```json
{
    "leadName": "Gourmet Bistro",
    "address": "123 Culinary Lane, Food City",
    "leadDate": "2024-12-25",
    "totalOrdersPlaced": 5,
    "status": "New",
    "pointOfContact": [
        {
            "name": "John Doe",
            "role": "Owner",
            "phone": "+1234567890",
            "email": "john.doe@example.com"
        }
    ],
    "order": [
        {
            "category": "Kitchen appliances",
            "count": 3,
            "dateTime": "2024-12-20T15:30:00.000Z",
            "details": "Order for new ovens and dishwashers."
        },
        {
            "category": "Furniture",
            "count": 1,
            "dateTime": "2024-12-22T10:00:00.000Z",
            "details": "Order for dining tables and chairs."
        }
    ],
    "call": [
        {
            "dateTime": "2024-12-24T14:00:00.000Z",
            "topic": "Discussing special holiday discounts",
            "comments": "Call with the owner to discuss discounts for Christmas season."
        }
    ]
}
```

---

#### Expected Response:
```json
{
    "_id": "64bd0c9e...",
    "leadName": "Gourmet Bistro",
    "address": "123 Culinary Lane, Food City",
    "leadDate": "2024-12-25T00:00:00.000Z",
    "totalOrdersPlaced": 5,
    "status": "New",
    "pointOfContact": [
        {
            "_id": "64bd0c9e...",
            "name": "John Doe",
            "role": "Owner",
            "phone": "+1234567890",
            "email": "john.doe@example.com"
        },
        {
            "_id": "64bd0c9e...",
            "name": "Jane Smith",
            "role": "Manager",
            "phone": "+0987654321",
            "email": "jane.smith@example.com"
        }
    ],
    "order": [
        {
            "_id": "64bd0c9e...",
            "category": "Kitchen appliances",
            "count": 3,
            "dateTime": "2024-12-20T15:30:00.000Z",
            "details": "Order for new ovens and dishwashers."
        },
        {
            "_id": "64bd0c9e...",
            "category": "Furniture",
            "count": 1,
            "dateTime": "2024-12-22T10:00:00.000Z",
            "details": "Order for dining tables and chairs."
        }
    ],
    "call": [
        {
            "_id": "64bd0c9e...",
            "dateTime": "2024-12-24T14:00:00.000Z",
            "topic": "Discussing special holiday discounts",
            "comments": "Call with the owner to discuss discounts for Christmas season."
        }
    ],
    "createdAt": "2024-12-26T12:00:00.000Z",
    "updatedAt": "2024-12-26T12:00:00.000Z",
    "__v": 0
}
```

---

This demonstrates how the nested schemas (`pointOfContact`, `order`, and `call`) are modularly structured and stored in MongoDB, while the Express.js API provides a clean way to handle nested input data.
*/


