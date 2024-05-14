const RideModel = require("../models/ride.model");


exports.getDriverDashboardMetrics = async (req, res, next) => {
    try {

        const dashboardDetails = await RideModel.aggregate([
            { $match: { driver: req.user._id, status: 'closed' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                    rides: { $sum: 1 },
                    earning: { $sum: "$fare" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const response = {
            totalRides: 0,
            totalEarning: 0,
            chartData: {
                rides: [],
                dates: [],
                earning:[]
            }
        };
        dashboardDetails.forEach((data)=>{
            response.totalRides += data.rides;
            response.totalEarning += data.earning;
            response.chartData.dates.push(data._id);
            response.chartData.rides.push(data.rides);
            response.chartData.earning.push(data.earning);
        })
        return res.status(200).json(response);

    } catch (err) {
        return next(err);
    }
}