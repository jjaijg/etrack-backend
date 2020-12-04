const {
  _allReportTxnService,
} = require('../../api/transactions/transaction.service');

const reports = {};

reports.parseDailyReport = async () => {
  try {
    const transactions = await _allReportTxnService();

    const dailyReportData = {};

    transactions.forEach((txn) => {
      const { email, ...txnData } = txn;
      if (email in dailyReportData) {
        dailyReportData[email].push(txnData);
      } else {
        dailyReportData[email] = [txnData];
      }
    });

    return dailyReportData;
  } catch (error) {
    throw error;
  }
};

module.exports = reports;
