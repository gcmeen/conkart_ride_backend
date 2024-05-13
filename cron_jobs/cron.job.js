const { CronJob } = require('cron');
const cronJobService = require('../services/cron_job.service');

const job = new CronJob(
    '01 * * * * *', // cronTime
    () => {
        console.log('============== Every minute cron job started ===================');

        //Update User status offline if no active since 30 minutes
        cronJobService.updateUserStatus();
        cronJobService.sendNotificationForNotBookedRide();

    }, // onTick
    null, // onComplete
    true, // start
);

module.exports = job;