
const catchAsync = require("./../utils/catchAsync");
const Order = require("./../models/orderModel");
const Logger = require("./../utils/Logger");
const AppError = require("../utils/appError");

exports.createAllOrders = catchAsync(async (req, res, next) => { 
    
    Logger.Info("** Inside createAllOrders **")
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
        length: newOrders.length,
        data: {
            newOrders
        }
    })
})

exports.deleteAllOrders = catchAsync(async (req, res, next) => {

    Logger.Info("** Inside deleteAllOrders **")
    const deletedOrders = await Order.deleteMany({});

    if (deletedOrders.deletedCount == 0)
    {
        return res.status(200).json({
            message: "Nothing present to delete"
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            deletedOrders
        }
    })

})

exports.getAllOrders = catchAsync(async (req, res, next) => {
    
    Logger.Info("** Inside getAllOrders **")
    const ordersPresent = await Order.find({});

    if (ordersPresent.length == 0)
    {
        return res.status(200).json({
            message: "No orders present"
        })
    }

    res.status(200).json({
        status: "success",
        length: ordersPresent.length,
        data: {
            ordersPresent
        }
    })
})

exports.getOrder = catchAsync(async (req, res, next) => {

    console.log("** Inside getOrder **");

    const id = req.params.id;

    const foundOrder = await Order.find({_id: id});
    
    if (foundOrder.length === 0)
    {
        return next(new AppError(`No order present for the id ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            foundOrder
        }
    })
})

exports.updatedOrder = catchAsync(async (req, res, next) => {

    const { name, category, count, dateTime, details } = req.body;
    const orderId = req.params.id;

    const fieldsToUpdate = {};

    if (name) fieldsToUpdate["name"] = name;
    if (category) fieldsToUpdate["category"] = category;
    if (count) fieldsToUpdate["count"] = count;
    if (dateTime) fiedsToUpdate["dateTime"] = new dateTime(dateTime);
    if (details) fiedsToUpdate["details"] = details;

    const updatedOrder = await Order.findOneAndUpdate(
        {_id: orderId},
        {$set: fieldsToUpdate},
        {new: true}
    )

    if (updatedOrder === null)
    {
        
    }

    res.status(200).json({
        status: "success",
        data: {
            updatedOrder
        }
    })

});

exports.updateOrder = catchAsync(async (req,res, next) => {
    
    const { name, category, count, dateTime, details } = req.body;
    const orderId = req.params.id; 

    const fieldsToUpdate = {};

    if (name) fieldsToUpdate['name'] = name;
    if (category) fieldsToUpdate['category'] = category;
    if (count) fieldsToUpdate['count'] = count;
    if (dateTime) fieldsToUpdate['dateTime'] = new Date(dateTime);
    if (details) fieldsToUpdate['details'] = details;

    const updatedOrder = await Order.findOneAndUpdate(
        {_id: orderId},
        {$set: fieldsToUpdate},
        {new: true}
    );

    if (updatedOrder === null)
    {
        return next(new AppError('No order present for the given id', 404));
    }

    return res.status(200).json({
        status: 'success',
        date: {
            updatedOrder
        }
    })
});

exports.deleteOrder = catchAsync(async (req, res, next) => {

    const orderId = req.params.id;

    const deletedOrder = await Order.findOneAndDelete({_id: orderId})

    if (deletedOrder === null)
    {
        return next(new AppError('No order present for the given id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            deletedOrder
        }
    });

})



// INSERT INTO [AuditLogItem] ("AuditorType", "EditorId", "UserRole", "TeamId", "UserIP", "UserHost", "AuditEventType", "Timestamp", "Asset", "AssetType", "AssetId", "RevisionInfoId", "Details", "ScheduleFlowId", "ScheduleEnvironmentId", "AccessKey", "Id") 

// SELECT "AuditorType", "EditorId", "UserRole", "TeamId", "UserIP", "UserHost", "AuditEventType", "Timestamp", "Asset", "AssetType", "AssetId", "RevisionInfoId", "Details", "ScheduleFlowId", "ScheduleEnvironmentId", "AccessKey", "Id" FROM (VALUES (@AuditorType, @EditorId, @UserRole, @TeamId, @UserIP, @UserHost, @AuditEventType, @Timestamp, @Asset, @AssetType, @AssetId, @RevisionInfoId, @Details, @ScheduleFlowId, @ScheduleEnvironmentId, @AccessKey, @Id)) ValuesSubTable("AuditorType", "EditorId", "UserRole", "TeamId", "UserIP", "UserHost", "AuditEventType", "Timestamp", "Asset", "AssetType", "AssetId", "RevisionInfoId", "Details", "ScheduleFlowId", "ScheduleEnvironmentId", "AccessKey", "Id");',N'@AccessKey nvarchar(4000),@Asset nvarchar(4000),@AssetId uniqueidentifier,@AssetType int,@AuditEventType int,@AuditorType int,@Details nvarchar(4000),@EditorId uniqueidentifier,@Id uniqueidentifier,@RevisionInfoId uniqueidentifier,@ScheduleEnvironmentId uniqueidentifier,@ScheduleFlowId uniqueidentifier,@TeamId uniqueidentifier,@Timestamp bigint,@UserHost nvarchar(4000),@UserIP nvarchar(4000),@UserRole int',@AccessKey=NULL,@Asset=N' Flow 4',@AssetId='D9F080BC-018F-48E3-B07F-660B881DC4B6',@AssetType=0,@AuditEventType=1050,@AuditorType=0,@Details=NULL,@EditorId='B53BAF84-75F2-4486-8775-819403507433',@Id='5E1E952A-678C-471A-AADA-1CFE19BED4DE',@RevisionInfoId=NULL,@ScheduleEnvironmentId=NULL,@ScheduleFlowId=NULL,@TeamId='9FB4EF50-6924-471D-8261-052AA8B572C9',@Timestamp=638731242750944504,@UserHost=N'AVDUESH-GAUTAM1',@UserIP=N'127.0.0.1',@UserRole=1





// INSERT INTO [BuildingBlockInfo] ("Title", "XPosition", "YPosition", "IsExpanded", "Width", "TemplateId", "FlowchartId", "Type", "Id") SELECT "Title", "XPosition", "YPosition", "IsExpanded", "Width", "TemplateId", "FlowchartId", "Type", "Id" FROM (VALUES (@Title, @XPosition, @YPosition, @IsExpanded, @Width, @TemplateId, @FlowchartId, @Type, @Id)) ValuesSubTable("Title", "XPosition", "YPosition", "IsExpanded", "Width", "TemplateId", "FlowchartId", "Type", "Id");',N'@FlowchartId uniqueidentifier,@Id uniqueidentifier,@IsExpanded bit,@TemplateId uniqueidentifier,@Title nvarchar(4000),@Type int,@Width float,@XPosition float,@YPosition float',@FlowchartId='2CA05C9A-A579-4803-82FC-6AE2EF247BC9',@Id='0E2FFCBD-F436-4F2A-8E47-8D6C9429B319',@IsExpanded=0,@TemplateId=NULL,@Title=N'Start',@Type=907,@Width=150,@XPosition=5000,@YPosition=5000


// INSERT INTO [BuildingBlockInfo] ("Title", "XPosition", "YPosition", "IsExpanded", "Width", "TemplateId", "FlowchartId", "Type", "Id") SELECT "Title", "XPosition", "YPosition", "IsExpanded", "Width", "TemplateId", "FlowchartId", "Type", "Id" FROM (VALUES (@Title, @XPosition, @YPosition, @IsExpanded, @Width, @TemplateId, @FlowchartId, @Type, @Id)) ValuesSubTable("Title", "XPosition", "YPosition", "IsExpanded", "Width", "TemplateId", "FlowchartId", "Type", "Id");',N'@FlowchartId uniqueidentifier,@Id uniqueidentifier,@IsExpanded bit,@TemplateId uniqueidentifier,@Title nvarchar(4000),@Type int,@Width float,@XPosition float,@YPosition float',@FlowchartId='2CA05C9A-A579-4803-82FC-6AE2EF247BC9',@Id='E80B3C3E-6D3F-4257-A345-52020EB1ACBD',@IsExpanded=0,@TemplateId='30C3D49D-6B93-4AD0-B4D0-6A2D3D214B2D',@Title=N'sf1',@Type=1001,@Width=150,@XPosition=5650,@YPosition=5100


// INSERT INTO [FlowPropertyInfo] ("ParentBuildingBlockId", "ParentFlowPropertyId", "TemplateId", "Type", "Key", "Title", "SortOrder", "ValueId", "LType", "IsExpanded", "Id") SELECT "ParentBuildingBlockId", "ParentFlowPropertyId", "TemplateId", "Type", "Key", "Title", "SortOrder", "ValueId", "LType", "IsExpanded", "Id" FROM (VALUES (@ParentBuildingBlockId, @ParentFlowPropertyId, @TemplateId, @Type, @Key, @Title, @SortOrder, @ValueId, @LType, @IsExpanded, @Id)) ValuesSubTable("ParentBuildingBlockId", "ParentFlowPropertyId", "TemplateId", "Type", "Key", "Title", "SortOrder", "ValueId", "LType", "IsExpanded", "Id");',N'@Id uniqueidentifier,@IsExpanded bit,@Key nvarchar(4000),@LType int,@ParentBuildingBlockId uniqueidentifier,@ParentFlowPropertyId uniqueidentifier,@SortOrder int,@TemplateId uniqueidentifier,@Title nvarchar(4000),@Type int,@ValueId uniqueidentifier',@Id='7D34EF0B-5142-40FB-9361-67F3A17CCF0D',@IsExpanded=0,@Key=N'Header',@LType=0,@ParentBuildingBlockId='E80B3C3E-6D3F-4257-A345-52020EB1ACBD',@ParentFlowPropertyId=NULL,@SortOrder=0,@TemplateId='FEBB6397-54D7-4A1E-8F49-E0893D54BD08',@Title=NULL,@Type=402,@ValueId='567CDFC4-8B4B-408C-A20C-C1787474C5C0'

