const messageConstants = require('../constants/message.constants');
const RideModel = require('../models/ride.model');
const UserModel = require('../models/user.model');
const NotificationModel = require('../models/notification.model');

exports.createRide = async (req, res, next) => {
    try {
        const driverFilter = { status: 'online', userType: "driver" }
        const drivers = await UserModel.find(driverFilter).lean();
        if (!drivers || !drivers.length) {
            return res.status(403).json({ message: messageConstants.driverNotFound })
        }

        const rideDetails = {
            pickup_location: req.body.pickup_location,
            drop_location: req.body.drop_location,
            user: req.body.user || req.user._id,
            trip_duration: req.body.trip_duration,
            start_location: req.body.start_location,
            end_location: req.body.end_location,
            fare: req.body.fare
        }

        const newRide = new RideModel(rideDetails);

        const createdRide = await newRide.save();
        if (!createdRide) {
            return res.status(400).json({ message: messageConstants.createRideFailed })
        }

        const user = await UserModel.findById(createdRide.user).lean();

        let notifications = [];
        drivers.forEach((driver) => {
            notifications.push({
                sender: createdRide.user,
                receiver: driver._id,
                ride: createdRide._id,
                type: 'ride_created',
                message: 'You have a ride request from ' + user.username + '.'
            });
        });

        await NotificationModel.insertMany(notifications);

        return res.status(200).json(createdRide);

    } catch (err) {
        return next(err);
    }
};

exports.updateRide = async (req, res, next) => {
    try {
        const updateData = req.body.updateData;

        if (Object.keys(updateData).length === 0) {
            return res.status(403).json({ message: messageConstants.updateDataRequired })
        }

        let rideDetails = await RideModel.findByIdAndUpdate(req.params.id, updateData).populate('user driver').lean();

        rideDetails.driver= await UserModel.findById(updateData.driver).lean();

        if (!rideDetails) {
            return res.status(404).json({ message: messageConstants.rideNotFound });
        }

        if (updateData.status ==='accepted') {
            const notifications = [
                {
                    sender: rideDetails.user._id,
                    receiver: updateData.driver,
                    ride: rideDetails._id,
                    type: 'ride_accepted',
                    message: 'You have ' + updateData.status + '  ride request from ' + rideDetails.user.username + '.'
                },
                {
                    sender: updateData.driver,
                    receiver: rideDetails.user._id,
                    ride: rideDetails._id,
                    type: 'ride_accepted',
                    message: 'Your ride request ' + updateData.status + ' by ' + rideDetails.driver.username + '.'
                }
            ];
            await NotificationModel.findOneAndDelete({ ride: rideDetails._id, receiver: updateData.driver });
            await NotificationModel.updateMany({ ride: rideDetails._id }, { message: "Ride taken by someone else", status: 'pending' });
            await NotificationModel.insertMany(notifications);
            await UserModel.findByIdAndUpdate(updateData.driver, { status: "busy" });
        }

        if(updateData.status=='closed'){
            await UserModel.findByIdAndUpdate(rideDetails.driver._id,{status:"online"})
        }

        delete rideDetails.user.password;
        delete rideDetails.driver.password;
        return res.status(200).json(rideDetails);

    } catch (err) {
        return next(err);
    }
};

exports.getRideById = async (req, res, next) => {
    try {
        const selectField = {
            _id: 1,
            username: 1,
            first_name: 1,
            last_name: 1,
            userType: 1,
            email: 1,
            mobile: 1,
            status: 1
        };
        const rideDetails = await RideModel.findById(req.params.id)
            .populate('user', selectField)
            .populate('driver', selectField).lean();

        if (!rideDetails) {
            return res.status(404).json({ message: messageConstants.rideNotFound });
        }

        return res.status(200).json(rideDetails);

    } catch (err) {
        return next(err);
    }
};

exports.getAllUserRides = async (req, res, next) => {
    try {
        const filter = {
            driver: req.user._id,
        };

        const selectField = {
            _id: 1,
            username: 1,
            first_name: 1,
            last_name: 1,
            userType: 1,
            email: 1,
            mobile: 1,
            status: 1
        }
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { createdAt: -1 },
            populate: [{
                path: 'user',
                select: selectField,
                model: 'User'
            }, {
                path: 'driver',
                select: selectField,
                model: 'User'
            }]
        };
        const rideDetails = await RideModel.paginate(filter, options);

        return res.status(200).json(rideDetails);

    } catch (err) {
        return next(err);
    }
};