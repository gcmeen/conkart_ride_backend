const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const UserModel = require("../models/user.model.js");

const verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token,
    config.jwtSecret,
    async (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      const user = await UserModel.findById(decoded.id).lean()
      if (!user) {
        return res.status(401).send({
          message: "Unauthorized!",
        })
      }
      delete user.password;
      req.user = user;
      next();
    });
};

module.exports = { verifyToken };
