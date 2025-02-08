
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const Lead = require("../models/leadModel");
const Order = require("../models/orderModel")
const CallLog = require("../models/callLogModel")

exports.getOverview = catchAsync(async (req, res) => 
{
    console.log("*** ViewsController.js :: getOverview ***");

    const leads = await Lead.find({});

    const assignedTo = [
        "Alice Johnson",
        "Bob Smith",
        "Charlie Davis",
        "Diana Prince",
        "Ethan Hunt",
        "Fiona Apple",
        "George Clooney",
        "Hannah Montana",
        "Ian Somerhalder",
        "Julia Roberts",
        "Kevin Bacon",
        "Laura Linney",
        "Michael Jordan",
        "Natalie Portman",
        "Oscar Isaac",
        "Pamela Anderson",
        "Quentin Tarantino",
        "Rachel McAdams",
        "Samuel L. Jackson",
        "Tina Fey"
      ];

    res.status(200).render("index", 
        {
            leads,
            assignedTo 
        }
    ); 
});
 
exports.getLead = catchAsync(async (req, res) => {

    console.log("*** ViewsController.js :: getLead ***");   
 
    const restaurantName = req.params.leadName; 

    const foundRestaurant = await Lead.findOne({leadName: restaurantName});
    let ordersPlaced = await Order.find({leadName: restaurantName});
    let callLogs = await CallLog.find({leadName: restaurantName});     

    if (foundRestaurant === null)
    { 
        return next(new AppError('No restaurant found for the given name'), 404);
    }

    // ordersPlaced === null ? "No Orders have been placed for this restaurant" : ordersPlaced;
    // callLogs === null ? "No calls have been made for this restaurant" : callLogs;

    res.status(200).render("leadDetails", {
        foundRestaurant,
        ordersPlaced,  
        callLogs
    });
     
}) 

  
 





 




