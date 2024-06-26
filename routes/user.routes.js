const express = require('express');

const router = express.Router();

const userController = require("../controllers/user.controller");

router.put("/", userController.updateUser);

module.exports = router;
