const express = require('express');
const router = express.Router();

const rideController = require("../controllers/ride.controller");

router.post("/", rideController.createRide);

router.put("/:id", rideController.updateRide);

router.get("/getAllByUser", rideController.getAllUserRides);

router.get("/:id", rideController.getRideById);

module.exports = router;
