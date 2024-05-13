const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const appConstants = require("../constants/app.constants");

const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: appConstants.notificationTypes,
  },
  status: {
    type: String,
    enum: appConstants.notificationStatus,
    default: 'pending'
  },
  message: {
    type: String
  }
}, { timestamps: true });

notificationSchema.plugin(mongoosePaginate);

const NotificationModel = mongoose.model("Notification", notificationSchema);
module.exports = NotificationModel;
