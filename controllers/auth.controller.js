const appConstants = require("../constants/app.constants");
const messageConstants = require("../constants/message.constants");
const UserModel = require("../models/user.model");
const config = require("../config/config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res, next) => {
  try {
    const newUser = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      userType: req.body.userType,
      mobile: req.body.mobile,
      first_name: req.body.first_name ? req.body.first_name : "",
      last_name: req.body.last_name ? req.body.last_name : "",
    });
    const user = await newUser.save();
    if (!user) {
      return res.status(500).send({ message: messageConstants.userCreateError });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      first_name: user.first_name,
      last_name: user.last_name
    });

  } catch (err) {
    return next(err);
  }
};

exports.signin = async (req, res, next) => {
  const { username, password } = req.body
  try {
    const user = await UserModel.findOne({ username }).exec();
    if (!user) return res.status(401).send({ message: messageConstants.userNotFound });

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: messageConstants.invalidPassword });
    }

    //generate jwt token
    const token = jwt.sign({ id: user.id },
      config.jwtSecret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

    await UserModel.findByIdAndUpdate(user._id, { status: "online" })
    req.session.token = token;

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      first_name: user.first_name,
      last_name: user.last_name,
      status: user.status
    });

  } catch (err) {
    return next(err);
  }
};

exports.signout = async (req, res, next) => {
  try {
    req.session = null;
    await UserModel.findByIdAndUpdate(req.user._id, { status: "offline" });
    return res.status(200).json({ message: messageConstants.signOut });
  } catch (err) {
    this.next(err);
  }
};
