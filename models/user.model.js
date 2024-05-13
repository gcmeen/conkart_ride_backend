const mongoose = require("mongoose");
const appConstants = require("../constants/app.constants");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String },
  userType: {
    type: String,
    enum: appConstants.userTypes,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  lastActiveTime: {
    type: Date,
    default: new Date()
  },
  status:{
    type: String,
    enum: appConstants.userStatus,
    default:'offline'
  },
  location: {
    type: { type: String },
    coordinates: [Number]
  }
}, { timestamps: true })

//index created for search by geo locations
userSchema.index({ "location": "2dsphere" });

const UserModel = mongoose.model("User",userSchema);
module.exports = UserModel;
