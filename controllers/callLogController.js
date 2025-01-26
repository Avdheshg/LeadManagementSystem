
const CallLog = require("./../models/callLogModel");
const catchAsync = require("./../utils/catchAsync");
const Logger = require("./../utils/Logger");
const AppError = require("./../utils/appError");

exports.createAllCallLogs = catchAsync(async (req, res, next) => { 
    
    Logger.Info("** Inside createAllCallLogs ** "); 
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
})

exports.deleteAllLogs = catchAsync(async (req, res, next) => {
    
    Logger.Info("** Inside deleteAllLogs ** ");
    const deletedLogs = await CallLog.deleteMany({}); 

    res.status(200).json({ 
        status: "success",  
        data: { 
            deletedLogs
        }   
    })
});


exports.getAllCallLogs = catchAsync(async (req, res, next) => {

    Logger.Info("** Inside getAllCallLogs ** ");
    const allCallLogsFound = await CallLog.find({});

    res.status(200).json({
        status: 'success',
        length: allCallLogsFound.length,
        data: {
            allCallLogsFound
        }
    })

})

exports.getCallLog = catchAsync(async (req, res, next) => {

    Logger.Info("** Inside getCallLog ** ");
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

})


exports.deleteCallLog = catchAsync(async (req, res, next) => {

    Logger.Info("** Inside deleteCallLog ** ");
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

})
  
exports.updateCallLog = catchAsync(async (req, res, next) => {
    
    Logger.Info("** Inside updateCallLog **");
    let { dateTime, agenda, comments } = req.body;
    const callId = req.params.callLogId;

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
})