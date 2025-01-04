
const express = require("express");

const restaurantController = require("./../controllers/restaurantController");

const router = express.Router();

router
    .route("/")
    .get(restaurantController.getAllRestaurants)
    .post(restaurantController.createNewRestaurants)
    .delete(restaurantController.deleteAllRestaurants)

router
    .route("/:restaurantName")
    .get(restaurantController.getARestaurant)
    .delete(restaurantController.deleteARestaurant)
    .patch(restaurantController.updateARestaurant)

module.exports = router;











