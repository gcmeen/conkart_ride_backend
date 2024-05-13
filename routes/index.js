const express = require('express');
const router = express.Router();

const { authJwt } = require("../middlewares");

const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const rideRoutes = require('./ride.routes')
const notificationRoutes = require('./notification.routes')
const dashboardRoutes = require('./dashboard.routes')

router.use('/auth',authRoutes);

router.use('/user',[authJwt.verifyToken],userRoutes);

router.use('/ride',[authJwt.verifyToken],rideRoutes);

router.use('/notification',[authJwt.verifyToken],notificationRoutes);

router.use('/dashboard',[authJwt.verifyToken],dashboardRoutes);

module.exports = router;
