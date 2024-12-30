
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
 
const Lead = require('./models/leadModel');
const CallLog = require('./models/callLogModel');
const Order = require("./models/orderModel");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
})
.then(con => {
    console.log('DB Conneciton Successful!...');  
})     

const app = express();
app.use(express.json());


// console.log(process.env);

// *******************      ** Restaurants **                 ************************************
app.get("/api/v1/leads/restaurants", async (req, res) => {
    
    try
    {
        const leadRestaurants = await Lead.find();

        res.status(200).json({
            status: "success",
            length: leadRestaurants.length,
            data: {
                leadRestaurants     
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
})   

app.post("/api/v1/leads/restaurants/newRestaurant", async (req, res) => {
    
    req.body.leadDate = new Date(req.body.leadDate);
    console.log(req.body.leadDate);
    
    const leadCreated = await Lead.create(req.body);
    
    res.status(201).json({
        status: "success",
        data: {
            leadCreated   
        }   
    })

})

app.post("/api/v1/leads/restaurants/createAll", async (req, res) => {
    try
    {
        const restaurantList = req.body;

        for (var i = 0; i < restaurantList.length; i++)
        {
            restaurantList[i].leadDate = new Date(restaurantList[i].leadDate)
        }

        const restaurantCreated = await Lead.insertMany(restaurantList);

        res.status(200).json({
            status: "success", 
            length: restaurantList.length,
            data: {
                restaurantList
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
})

app.delete("/api/v1/leads/restaurants/deleteAll", async (req, res) => {
    const deletedItems = await Lead.deleteMany({});

    res.status(200).json({
        status: "success",      
        message: "All delelted.."
    })  

})

app.delete("/api/v1/leads/restaurants/:restaurantName", async (req, res) => { 
    try
    {

        const restaurantName = req.params.restaurantName;
        const deletedItem = await Lead.deleteOne({leadName: restaurantName}); 

        if (deletedItem.deletedCount == 0)
        {
            return res.status(404).json({
                status: "fail",
                data: {   
                    message: "No restaurant present for this name"
                }
            })
        }

        res.status(200).json({
            status: "success",
            data: {
                deletedItem
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
});

app.patch("/api/v1/leads/restaurants/:restaurantName", async (req, res) => {
    
    try {
        const restaurantName = req.params.restaurantName;

        // const restaurant = Lead.findOne({restaurantName});

        const totalOrdersPlaced = req.body.totalOrdersPlaced;
        const leadType = req.body.leadType;

        const updatedRestaurant = await Lead.findOneAndUpdate({leadName: restaurantName}, req.body, {
            new: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                updatedRestaurant
            }
        })

    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }  
})
// *******************       Restaurants                 ************************************


// *******************      ** CONTACTS **                 ************************************
// Getting all the contacts for the restaurant
app.get("/api/v1/leads/restaurants/:restaurantName/pointOfContact", async (req, res) => {
    
    try 
    {
        const leadName = req.params.restaurantName;
        let restaurant = await Lead.findOne({leadName}); 

        const contacts = restaurant.pointOfContact;
    
        res.status(200).json({
            status: "success",
            length: contacts.length,
            data: {
                contacts  
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
})

// Adding a new POC for the restaurant
app.post("/api/v1/leads/restaurants/:restaurantName/pointOfContact", async (req, res) => {
    
    try
    {
        const restaurantName = req.params.restaurantName; 
        const { name, role, phone, email } = req.body;

        const existingPOC = await Lead.find({ 
            leadName: restaurantName,
            $or: [
                {"pointOfContact.name": name},
                {"pointOfContact.email": email},
                {"pointOfContact.phone": phone}
            ]
        })

        if (existingPOC.length !== 0)
        {
            return res.status(404).json({ 
                status: 'fail',
                message: 'Either no restaurant present for this name or the entered contact already present for this restaurant. Cannot add.'
            });   
        }

        const updatedRestaurant = await Lead.findOneAndUpdate( 
            {leadName: restaurantName}, 
            {
                $push: {
                    pointOfContact: {
                        name, role, phone, email
                    }
                }
            },
            {new: true}
        )

        res.status(200).json({
            status: "success",
            data: {
                updatedRestaurant
            }
        });
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
})  

// updating the contact number for a restaurant   ** UPDATE THIS LOGIC 
app.patch("/api/v1/leads/restaurants/:restaurantName/pointOfContact/:pocId", async (req, res) => {
    try 
    {        
        // let x = await Lead.findOne({'pointOfContact._id': '676fd87c69c6a1066babc532' }); 
        const { restaurantName, pocId } = req.params;
        const { role, email } = req.body;

        const fieldsToUpdate = {};

        if (role) fieldsToUpdate["pointOfContact.$.role"] = role; 
        if (email) fieldsToUpdate["pointOfContact.$.email"] = email;

        const updatedRestaurant = await Lead.findOneAndUpdate(
            {leadName: restaurantName, "pointOfContact._id": pocId}, 
            {$set: fieldsToUpdate},
            {new: true}
        )

        if (updatedRestaurant === null) 
        {
            res.status(404).json({
                status: 'fail',
                message: 'No Restaurant found for the given input!'
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                updatedRestaurant
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
})

app.delete("/api/v1/leads/restaurants/:restaurantName/pointOfContact/:pocId", async (req, res) => {
    
    try
    {
        const { restaurantName, pocId } = req.params;

        const deletedContact = await Lead.findOneAndUpdate(
            {leadName: restaurantName},
            {
                $pull: { pointOfContact: {_id: pocId} }
            },
            {new: true}
        )

        if (deletedContact === false)
        {
            res.status(404).json({
                status: 'fail',
                message: 'No contact found for this Id'
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                deletedContact
            }
        });
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }

})

// *******************      ** CALLS LOGS **                 ************************************
app.post("/api/v1/leads/restaurants/callLog/createAll", async (req, res) => { 

    try   
    {      
        const callLogs = req.body;

        for (var i = 0; i < callLogs.length; i++)
        {  
            callLogs[i].dateTime = new Date(callLogs[i].dateTime)
        }

        const callLogsCreated = await CallLog.insertMany(callLogs);

        res.status(200).json({ 
            status: "success", 
            length: callLogsCreated.length, 
            data: {
                callLogsCreated
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }

})

app.delete("/api/v1/leads/restaurants/callLog/deleteAll", async (req, res) => {
    try
    {
        const deletedLogs = await CallLog.deleteMany({});

        res.status(200).json({ 
            status: "success",  
            data: {
                deletedLogs
            }
        })

    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
})

// Add a call for a POC
app.post("/api/v1/leads/restaurants/:restaurantName/callLog/:pocId", async (req, res) => {
    try
    {
        const { leadName, dateTime, agenda, comments } = req.body;
        const { restaurantName, pocId } = req.params;

        const addedCall = await CallLog.create({leadName, dateTime: new Date(dateTime), agenda, comments});

        res.status(201).json({ 
            status: "success", 
            data: {
                addedCall
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
})

app.patch("/api/v1/leads/restaurants/:restaurantName/callLog/:callId", async (req, res) => {
    
    try
    {

        let { dateTime, agenda, comments } = req.body;
        const callId = req.params.callId;

        const fieldsToUpdate = {}; 

        if (dateTime) 
        {
            dateTime = new Date(dateTime);
            fieldsToUpdate["dateTime"] = dateTime;  
        }
        if (agenda) fieldsToUpdate["agenda"] = agenda;
        if (comments) fieldsToUpdate["comments"] = comments;

        const updatedCallLog = await CallLog.findOneAndUpdate(
            {_id: callId}, 
            // {comments: comments},
            {$set: fieldsToUpdate},
            {new: true}
        )

        if (updatedCallLog === null) 
        {
            res.status(404).json({
                status: 'fail',
                message: 'No contact found for the given input!'
            });
        }

        res.status(200).json({  
            status: "success", 
            data: {
                updatedCallLog
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }


})


// *******************      ** ORDER MODEL **                 ************************************
app.post("/api/v1/leads/restaurants/orders/createAll", async (req, res) => { 
    try
    {
        const orderToCreate = req.body;

        const createdOrders = await Order.insertMany(orderToCreate);

        res.status(200).json({ 
            status: "success", 
            length: createdOrders.length,
            data: {
                createdOrders
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
})

app.post("/api/v1/leads/restaurants/:restaurantName/orders", async (req, res) => {
    try
    {

        const { name, category, count, dateTime, details } = req.body;
        const restaurantName = req.params.restaurantName;

        const newOrder = await Order.create({leadName: restaurantName, name, category, count, dateTime, details});

        res.status(200).json({ 
            status: "success", 
            data: {
                newOrder
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
})

app.get("/api/v1/leads/restaurants/:restaurantName/orders/:orderId", async (req, res) => {
    try
    {
        const orderId = req.params.orderId;

        const foundOrder = await Order.findOne({_id: orderId});

        if (foundOrder === null)
        {
            return res.status(404).json({
                status: 'fail',
                message: 'No order present for the given id!!'
            });
        }
 
        res.status(200).json({ 
            status: "success", 
            data: {
                foundOrder
            }
        })
    }
    catch (err)
    {
        res.status(404).json({   
            status: 'fail',
            message: err.message
        });
    }
})

app.patch("/api/v1/leads/restaurants/:restaurantName/orders/:orderId", async (req, res) => {
    try
    {
        const { name, category, count, dateTime, details } = req.body;
        const orderId = req.params.orderId;

        const fieldsToUpdate = {};

        if (name) fieldsToUpdate["name"] = name;
        if (category) fieldsToUpdate["category"] = category;
        if (count) fieldsToUpdate["count"] = count;
        if (dateTime) fieldsToUpdate["dateTime"] = dateTime; 
        if (details) fieldsToUpdate["details"] = details;

        const updatedOrder = await Order.findOneAndUpdate(
            {_id: orderId}, 
            {$set: fieldsToUpdate},
            {new: true}
        ) 

        if (updatedOrder === null)
        {
            return res.status(404).json({
                status: 'fail',
                message: 'No order present for the given id'
            });
        }

        res.status(200).json({ 
            status: "success",  
            data: {
                updatedOrder
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
})

app.delete("/api/v1/leads/restaurants/:restaurantName/orders/:orderId", async (req, res) => {
    try
    {
        const orderId = req.params.orderId;

        const deletedOrder = await Order.findOneAndDelete({_id: orderId});
        
        if (deletedOrder === null)
        {
            return res.status(404).json({
                status: 'fail',
                message: 'No order present for the given Id'
            });
        }

        res.status(200).json({ 
            status: "success", 
            data: {
                
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
})

const port = process.env.PORT || 3000;  
app.listen(port, () => { 
    console.log(`App is running on the port ${port}`)       
}) 

/*
 
    try
    {
        res.status(200).json({ 
            status: "success", 
            data: {
                callLogsCreated
            }
        })
    }
    catch (err)
    {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }

*/

