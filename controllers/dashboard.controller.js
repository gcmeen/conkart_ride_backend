const RideModel = require("../models/ride.model");


exports.getDriverDashboardMetrics = async (req, res, next) => {
    try {

        const dashboardDetails = await RideModel.aggregate([
            { $match: { driver: req.user._id, status: 'closed' } },
            {
                $group: {
                    _id: null,
                    totalRide: { $sum: 1 },
                    totalEarning: { $sum: "$fare" }
                }
            }
        ]);


        return res.status(200).json(dashboardDetails[0]);

    } catch (err) {
        return next(err);
    }
}