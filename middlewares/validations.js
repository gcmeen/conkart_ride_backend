const UserModel = require("../models/user.model");
const messageConstants = require("../constants/message.constants");


checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    // Username
    const userNameFound = await UserModel.findOne({ username });
    if (userNameFound) {
      return res.status(400).send({ message: messageConstants.usernameAlreadyExist });
    }

    //email
    const emailFound = await UserModel.findOne({ email });
    if (emailFound) {
      return res.status(400).send({ message: messageConstants.emailAlreadyExist });
    }
    next();
  }
  catch (err) {
    return next(err);
  }
};

module.exports = {
  checkDuplicateUsernameOrEmail,
};;
