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
      const fmtDate = new Date(txnData.tdate);
      const tdate = `${fmtDate.getDate()}-${fmtDate.getMonth()}-${fmtDate.getFullYear()}`;
      if (email in dailyReportData) {
        dailyReportData[email].push({ ...txnData, tdate });
      } else {
        dailyReportData[email] = [{ ...txnData, tdate }];
      }
    });

    return dailyReportData;
  } catch (error) {
    throw error;
  }
};

module.exports = reports;
