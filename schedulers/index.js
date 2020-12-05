const cron = require('node-cron');

const genReport = require('../report-generators/genReport');
const { sendMail } = require('../mailer/reportSender');
const { parseDailyReport } = require('../report-generators/resources/data');

const schedulers = {};

schedulers.dailyScheduler = (cron_data = '* * * * *') => {
  cron.schedule(cron_data, async () => {
    try {
      console.log('running a task every day at 23:55hr');
      // Data
      var mailData = await parseDailyReport();
      Object.entries(mailData).forEach(async ([email, txns]) => {
        if (txns.length) {
          // Gen report
          const filePath = await genReport(email, txns);
          // mail sender
          await sendMail(
            'Mtracker - Daily Report',
            'Please find your daily report',
            email,
            filePath.filename
          );
          console.log('email sent ✓');
        }
      });
    } catch (error) {
      console.log('scheduler error : ', error);
    }
  });
};

module.exports = schedulers;
