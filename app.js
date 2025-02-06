
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
const path = require('path');
 
const Lead = require('./models/leadModel');
const CallLog = require('./models/callLogModel');
const Order = require("./models/orderModel");

const restaurantRoutes = require("./routes/restaurantRoutes");
const callLogRoutes = require("./routes/callLogRoutes");
const orderRoute = require("./routes/orderRoutes");
const viewsRoute = require("./routes/viewsRoutes");

const globalErrorHandler = require("./controllers/errorController");

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
 
app.set("view engine", "pug");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 

console.log((path.join(__dirname, 'public')))

// console.log(process.env);

app.use("/leads", viewsRoute)

// *******************      ** Restaurants / POC **                 ************************************
app.use("/api/v1/leads/restaurants", restaurantRoutes);


// *******************      ** CALLS LOGS **                 ************************************

app.use("/api/v1/leads/callLogs", callLogRoutes);


// *******************      ** ORDER MODEL **                 ************************************
app.use("/api/v1/leads/orders", orderRoute);


app.all("*", (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler); 
 
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

