
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
    .get(restaurantController.getRestaurant)
    .delete(restaurantController.deleteRestaurant)
    .patch(restaurantController.updateRestaurant)

router
    .route("/:restaurantName/pointOfContacts")
    .get(restaurantController.getAllPOC)
    .post(restaurantController.addPOC) 

router
    .route("/:restaurantName/pointOfContacts/:pocId")
    .patch(restaurantController.updatePOC)
    .delete(restaurantController.deletePOC)

module.exports = router;











