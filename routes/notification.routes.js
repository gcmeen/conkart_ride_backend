const express = require('express');

const router = express.Router();

const notificationController = require("../controllers/notification.controller");

router.get("/getByStatus", notificationController.getNotificationByStatus);

router.get("/getCount", notificationController.getNotificationCount);

router.put("/updateStatus", notificationController.updateNotificationStatus);

module.exports = router;
