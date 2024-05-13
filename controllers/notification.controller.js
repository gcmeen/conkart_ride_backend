const messageConstants = require('../constants/message.constants');
const NotificationModel = require('../models/notification.model');
const UserModel = require('../models/user.model');

exports.getNotificationByStatus = async (req, res, next) => {
    try {
        const filter = {
            receiver: req.user._id,
        };
        if (req.query.status) filter.status = { $in: req.query.status };

        const notificationDetails = await NotificationModel.find(filter).populate('sender ride').sort({ _id: -1 }).lean();

        return res.status(200).json(notificationDetails);

    } catch (err) {
        return next(err);
    }
};

exports.getNotificationCount = async (req, res, next) => {
    try {
        const filter = {
            receiver: req.user._id,
        };
        if (req.query.status) filter.status = { $in: req.query.status };

        const notificationDetails = await NotificationModel.countDocuments(filter).exec();

        await UserModel.findByIdAndUpdate(req.user._id, { lastActiveTime: new Date() });

        return res.status(200).json(notificationDetails);

    } catch (err) {
        return next(err);
    }
};


exports.updateNotificationStatus = async (req, res, next) => {
    try {
        const filter = {
            _id: { $in: req.body.notifications },
        };

        const notificationDetails = await NotificationModel.updateMany(filter, { status: req.body.status });

        return res.status(200).json({});

    } catch (err) {
        return next(err);
    }
};
