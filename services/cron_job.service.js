const UserModel = require('../models/user.model');
const RideModel = require('../models/ride.model');
const NotificationModel = require('../models/notification.model');

// User Status set offline if not doing activity for 30 minutes
exports.updateUserStatus = async () => {
    try {
        let date = new Date();
        date.setMinutes(new Date().getMinutes() - 30);

        const filter = {
            lastActiveTime: { $lte: date },
            status:'online'
        };

        const offilneUser = await UserModel.updateMany(filter, { status: 'offline' }).exec();

        console.log('User status updated to offline for ', offilneUser);
        return;
    } catch (err) {
        console.log('Error While Update user status cron job ', err);
    }
}

// If Ride not book for 5 minutes send notification to admin 
exports.sendNotificationForNotBookedRide = async () => {
    try {
        let date = new Date();
        date.setMinutes(new Date().getMinutes() - 5);

        const filter = {
            createdAt: { $lte: date },
            status: 'open'
        };

        const rideDetails = await RideModel.find(filter).populate('user').lean();
        if (!rideDetails || !rideDetails.length) {
            console.log("No Opne ride found for reject");
            return
        };

        const adminUserDetails = await UserModel.find({ userType: 'admin' }).lean();
        if (!adminUserDetails || !adminUserDetails.length) return;

        const notifications = [];
        rideDetails.forEach((ride) => {
            notifications.push({
                sender: adminUserDetails[0]._id,
                receiver: ride.user._id,
                ride: ride._id,
                type: 'ride_rejected',
                message: 'Your ride request has been cancelled beacuse nobody accepted it since 5 minutes.'
            });
            adminUserDetails.forEach((admin) => {
                notifications.push({
                    sender: ride.user._id,
                    receiver: admin._id,
                    ride: ride._id,
                    type: 'ride_rejected',
                    message: ride.user.username + ' ride has been rejected bacause nobody accepted ride since 5 minutes'
                });
            });
        });

        await RideModel.updateMany({ _id: { $in: rideDetails.map(ride => ride._id.toString()) } },{status:"rejected"}).exec();
        await NotificationModel.insertMany(notifications);

        console.log('Notifications sent for not booked ride ');
        return;
    } catch (err) {
        console.log('Error While Update user status cron job ', err);
    }
}