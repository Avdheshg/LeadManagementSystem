
const express = require("express");

const callLogController = require("./../controllers/callLogController");

const router = express.Router();

router
    .route("/")
    .post(callLogController.createAllCallLogs)
    .get(callLogController.getAllCallLogs)
    .delete(callLogController.deleteAllLogs)

router
    .route("/:callLogId")
    .get(callLogController.getCallLog)
    .patch(callLogController.updateCallLog)
    .delete(callLogController.deleteCallLog)

module.exports = router;


























