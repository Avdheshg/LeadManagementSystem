
const catchAsync = require("./../utils/catchAsync");
const Lead = require("./../models/leadModel");
const AppError = require("./../utils/appError");

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
    
    const restaurants = await Lead.find();

    res.status(200).json({
        status: "success",
        length: restaurants.length,
        data: {
            restaurants     
        } 
    })
}); 

exports.createNewRestaurants = catchAsync(async (req, res, next) => {
    
    const restaurantList = req.body;

    let restaurantCreated;

    if (Array.isArray(restaurantList) == false)
    {
        restaurantList.leadDate = new Date(restaurantList.leadDate);
        restaurantCreated = await Lead.create(req.body)
    }
    else 
    {
        for (var i = 0; i < restaurantList.length; i++)
        {
            restaurantList[i].leadDate = new Date(restaurantList[i].leadDate)
        }
    
        restaurantCreated = await Lead.insertMany(restaurantList);
    }

    res.status(200).json({
        status: "success", 
        length: restaurantList.length,
        data: {
            restaurantList
        }
    })
}); 

exports.deleteAllRestaurants = catchAsync(async (req, res, next) => {
    const deletedItems = await Lead.deleteMany({});

    res.status(200).json({
        status: "success",      
        message: "All delelted.."
    })  
})

exports.getARestaurant = catchAsync(async (req, res, next) => {

    const restaurantName = req.params.restaurantName; 
    const foundRestaurant = await Lead.findOne({leadName: restaurantName});

    if (foundRestaurant === null) 
    {
        return next(new AppError(`No restaurant present for the name: ${restaurantName}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            foundRestaurant
        }
    })

})

exports.deleteARestaurant = catchAsync(async (req, res, next) => { 

    const restaurantName = req.params.restaurantName;
    const deletedItem = await Lead.deleteOne({leadName: restaurantName});  

    if (deletedItem.deletedCount == 0)
    {
        return next(new AppError(`No restaurant present for the name: ${restaurantName}`, 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            deletedItem
        }
    })
})

exports.updateARestaurant = catchAsync(async (req, res, next) => {

    const restaurantName = req.params.restaurantName;
    const { totalOrdersPlaced, leadType } = req.body;

    const fieldsToUpdate = {};

    if (totalOrdersPlaced) fieldsToUpdate["totalOrdersPlaced"] = totalOrdersPlaced;
    if (leadType) fieldsToUpdate["leadType"] = leadType;

    const updatedRestaurant = await Lead.findOneAndUpdate(
        {leadName: restaurantName}, 
        {$set: fieldsToUpdate}, 
        { new: true }
    )

    if (updatedRestaurant === null)
    {
        return next(new AppError(`No restaurant present for the name: ${restaurantName}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            updatedRestaurant
        }
    }) 
})
















