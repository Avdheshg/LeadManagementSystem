
const catchAsync = require("./../utils/catchAsync");
const Lead = require("./../models/leadModel");
const AppError = require("./../utils/appError");
const Logger = require("./../utils/Logger");

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
    
    Logger.Info("** Inside getAllRestaurants ** ");
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
    
    Logger.Info("** Inside createNewRestaurants ** ");
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

    Logger.Info("** Inside deleteAllRestaurants ** ");
    const deletedItems = await Lead.deleteMany({});

    res.status(200).json({
        status: "success",      
        message: "All delelted.."
    })  
})

exports.getRestaurant = catchAsync(async (req, res, next) => {

    Logger.Info("** Inside getRestaurant ** ");
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

exports.deleteRestaurant = catchAsync(async (req, res, next) => { 

    Logger.Info("** Inside deleteRestaurant ** ");
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

exports.updateRestaurant = catchAsync(async (req, res, next) => {

    Logger.Info("** Inside updateRestaurant ** ");
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

// *******************      ** CONTACTS **                 ************************************

exports.getAllPOC = catchAsync(async (req, res, next) => { 
     
    Logger.Info("** Inside getAllPOC ** ");
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
});

exports.addPOC = catchAsync(async (req, res, next) => { 
    
    Logger.Info("** Inside addPOC ** ");
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
})

exports.updatePOC = catchAsync(async (req, res, next) => {
    
    Logger.Info("** Inside updatePOC ** ");
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
})

exports.deletePOC = catchAsync(async (req, res, next) => {
    
    Logger.Info("** Inside deletePOC ** ");
    const { restaurantName, pocId } = req.params;

    const deletedContact = await Lead.findOneAndUpdate(
        {leadName: restaurantName},
        {
            $pull: { pointOfContact: {_id: pocId} } 
        },
        {
            new: true 
        }
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
})






  





