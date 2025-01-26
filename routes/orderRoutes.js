
const express = require("express");

const orderController = require("./../controllers/orderController");

const router = express.Router();

router
    .route("/")
    .post(orderController.createAllOrders)
    .delete(orderController.deleteAllOrders)
    .get(orderController.getAllOrders)

router
    .route("/:id")
    .get(orderController.getOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder)

module.exports = router;



