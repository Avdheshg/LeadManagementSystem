
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
 
const Lead = require('./models/leadModel');
const CallLog = require('./models/callLogModel');
const Order = require("./models/orderModel");

const restaurantRoutes = require("./routes/restaurantRoutes");

const AppError = require("./utils/appError");
const catchAsync = require("./utils/catchAsync");

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
app.use("/api/v1/leads/restaurants", restaurantRoutes);
   

// *******************      ** CONTACTS **                 ************************************

app.get("/api/v1/leads/restaurants/:restaurantName/pointOfContacts", catchAsync(async (req, res, next) => {
    
    const restaurantName = req.params.restaurantName; 
    let foundRestaurant = await Lead.findOne({leadName: restaurantName});   

    if (foundRestaurant === null)
    {
        return next(new AppError(`No restaurant present for the name: ${restaurantName}`, 404));
    }

    const contacts = foundRestaurant.pointOfContact;

    res.status(200).json({
        status: "success",
        length: contacts.length,
        data: {
            contacts  
        }
    })
}))

app.post("/api/v1/leads/restaurants/:restaurantName/pointOfContact", catchAsync(async (req, res, next) => {
    
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
        return next(new AppError(`Cannot add! The entered contact already present for this restaurant.`, 404));
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
}))  

// updating the contact number for a restaurant
app.patch("/api/v1/leads/restaurants/:restaurantName/pointOfContact/:pocId", catchAsync(async (req, res, next) => {
    
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
        return next(new AppError(`No restaurant present for the name: ${restaurantName}`, 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            updatedRestaurant
        }
    })
}))

app.delete("/api/v1/leads/restaurants/:restaurantName/pointOfContact/:pocId", catchAsync(async (req, res, next) => {
    
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
        return next(new AppError('No contact found for this Id', 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            deletedContact
        }
    });
}))

// *******************      ** CALLS LOGS **                 ************************************
// createAll
app.post("/api/v1/leads/callLogs", catchAsync(async (req, res, next) => { 
    
    const callLogs = req.body;

    let callLogsCreated;

    if (Array.isArray(callLogs) === false)
    {
        callLogs.dateTime = new Date(callLogs.dateTime);
        const { leadName, pocId, dateTime, agenda, comments } = req.body;

        callLogsCreated = await CallLog.create({leadName, pocId, dateTime, agenda, comments});
    }
    else 
    {
        const filteredArray = [];
        for (var i = 0; i < callLogs.length; i++)
        {   
            const { leadName, pocId, dateTime, agenda, comments } = callLogs[i];

            filteredArray.push({leadName, pocId, dateTime, agenda, comments});
            filteredArray[i].dateTime = new Date(callLogs[i].dateTime);
        }
        
        callLogsCreated = await CallLog.insertMany(filteredArray);
    }

    res.status(200).json({ 
        status: "success", 
        length: callLogsCreated.length, 
        data: {
            callLogsCreated
        }
    })
}))

app.get("/api/v1/leads/callLogs", catchAsync(async (req, res, next) => {

    const allCallLogsFound = await CallLog.find({});

    res.status(200).json({
        status: 'success',
        length: allCallLogsFound.length,
        data: {
            allCallLogsFound
        }
    })

}));

app.get("/api/v1/leads/callLogs/:callLogId", catchAsync(async (req, res, next) => {

    const foundLog = await CallLog.findOne({_id: req.params.callLogId});

    if (foundLog === null)
    {
        return next(new AppError("No call is found with the given id", 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            foundLog
        }
    })

}) )

app.delete("/api/v1/leads/callLogs", catchAsync(async (req, res, next) => {
    
    const deletedLogs = await CallLog.deleteMany({}); 

    res.status(200).json({ 
        status: "success",  
        data: { 
            deletedLogs
        }
    })
}))

app.delete("/api/v1/leads/callLogs/:callLogId", catchAsync(async (req, res, next) => {

    const deletedCallLog = await CallLog.deleteOne({_id: req.params.callLogId});

    if (deletedCallLog.deletedCount == 0)
    {
        return next(new AppError(`No restaurant present for the given Id`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            deletedCallLog
        }
    })

}) )

app.patch("/api/v1/leads/callLogs/:callId", catchAsync(async (req, res, next) => {
    
    let { dateTime, agenda, comments } = req.body;
    const callId = req.params.callId;

    const fieldsToUpdate = {}; 

    if (dateTime) 
    {
        fieldsToUpdate["dateTime"] = new Date(dateTime);  
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
        return next(new AppError('No contact found for the given input!', 404));
    }

    res.status(200).json({  
        status: "success", 
        data: {
            updatedCallLog
        }
    })
}))


// *******************      ** ORDER MODEL **                 ************************************
app.post("/api/v1/leads/orders", catchAsync(async (req, res, next) => { 
    
    const ordersToCreate = req.body;
    let newOrders;

    if (Array.isArray(ordersToCreate) === false)
    {
        const { leadName, name, category, count, dateTime, details } = req.body;

        newOrders = await Order.create({leadName, name, category, count, dateTime, details});
    }
    else 
    {   
        const filteredArray = [];

        for (let i = 0; i < ordersToCreate.length; i++)
        {
            const { leadName, name, category, count, dateTime, details } = ordersToCreate[i];
            
            filteredArray.push({leadName, name, category, count, dateTime, details});
            filteredArray[i].dateTime = new Date(dateTime);
        }
        
        newOrders = await Order.insertMany(ordersToCreate);
    }

    res.status(200).json({ 
        status: "success", 
        length: createdOrders.length,
        data: {
            createdOrders
        }
    })
}))

app.get("/api/v1/leads/orders", catchAsync(async (req, res, next) => {

    const ordersFound = await Order.find({});

    res.status(200).json({
        status: 'success',
        length: ordersFound.length,
        data: {
            ordersFound
        }
    })

}) )

app.get("/api/v1/leads/orders/:orderId", catchAsync(async (req, res) => {
    
    const orderId = req.params.orderId;

    const foundOrder = await Order.findOne({_id: orderId});

    if (foundOrder === null)
    {
        return next(new AppError('No order present for the given id!!', 404));
    }

    res.status(200).json({ 
        status: "success", 
        data: {
            foundOrder
        }
    })
}))

app.patch("/api/v1/leads/orders/:orderId", catchAsync(async (req, res, next) => {
    
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
        return next(new AppError('No order present for the given id', 404));
    }

    res.status(200).json({ 
        status: "success",  
        data: {
            updatedOrder
        }
    });
}))

app.delete("/api/v1/leads/orders/:orderId", catchAsync(async (req, res, next) => {
    
    const orderId = req.params.orderId;

    const deletedOrder = await Order.findOneAndDelete({_id: orderId});
    
    if (deletedOrder === null)
    {
        return next(new AppError('No order present for the given id', 404));
    }

    res.status(200).json({ 
        status: "success", 
        data: {
            deletedOrder
        }
    });
}))

app.all("*", (req, res, next) => {
    next(new AppError('Cannot find ${req.originalUrl} on this server!', 404));
})

app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 500; 
    err.status = err.status || 'error'; 

    res.status(err.statusCode).json({
        status: err.status,  
        message: err.message   
    })

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

