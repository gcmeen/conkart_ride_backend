const express = require('express')
const router = express.Router()

const { validations } = require("../middlewares");
const controller = require("../controllers/auth.controller");

router.post("/signup",
  [
    validations.checkDuplicateUsernameOrEmail,
  ],
  controller.signup
);

router.post("/signin", controller.signin);

router.post("/signout", controller.signout);

module.exports = router;