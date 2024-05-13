const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const appConstants = require("../constants/app.constants");

const rideSchema = new mongoose.Schema({
  pickup_location: {
    type: String,
    required: true,
  },
  drop_location: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: appConstants.rideStatus,
    default: 'open'
  },
  trip_duration: {
    type: Number,
    require: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  start_location: {
    type: { type: String },
    coordinates: [Number]
  },
  end_location: {
    type: { type: String },
    coordinates: [Number]
  },
  maxDistance:{
    type:Number
  },
  fare:{
    type:Number
  },
}, { timestamps: true });

rideSchema.plugin(mongoosePaginate);

// index document by start location field
rideSchema.index({ "start_location": "2dsphere" });

// index document by end location field
rideSchema.index({ "end_location": "2dsphere" });

const RideModel = mongoose.model("Ride", rideSchema);
module.exports = RideModel;
