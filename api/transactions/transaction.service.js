const { pool1 } = require('../../config/database');

const txnService = {};

txnService.getTxnByIdService = async (id, uid) => {
  try {
    return await pool1.query(`select * from transaction where id=? and uid=?`, [
      id,
      uid,
    ]);
  } catch (error) {
    throw error;
  }
};

txnService.createTxnService = async (newTxn) => {
  try {
    const { uid, cid, description, type, amount, tdate } = newTxn;

    const isTxnAdded = await pool1.query(
      `insert into transaction(uid, cid, amount, type, description, tdate) values(?,?,?,?,?,?)`,
      [uid, cid, amount, type, description, tdate]
    );
    if (isTxnAdded.affectedRows) {
      const txn = await txnService.getTxnByIdService(isTxnAdded.insertId, uid);
      if (txn.length) {
        return txn[0];
      } else {
        throw new Error(
          'Error in getting the transaction, please refresh the page!'
        );
      }
    } else {
      throw new Error('Error in adding the transaction, please try again');
    }
  } catch (error) {
    throw error;
  }
};

txnService.updateTxnService = async (id, updTxn) => {
  try {
    const { uid, cid, type, description, amount, tdate } = updTxn;

    return await pool1.query(
      `update transaction set cid=?, amount=?, type=?, description=?, updatedAt=CURRENT_TIMESTAMP(), tdate=? where id=? and uid=?`,
      [cid, amount, type, description, tdate, id, uid]
    );
  } catch (error) {
    throw error;
  }
};

txnService.deleteTxnService = async (id, uid) => {
  try {
    return await pool1.query(`delete from transaction where id=? and uid=?`, [
      id,
      uid,
    ]);
  } catch (error) {
    throw error;
  }
};

txnService.getTxnByUserService = async (uid) => {
  try {
    return await pool1.query(
      `select t.id, cid, amount, type, description, tdate, name from transaction as t inner join category as c on t.cid=c.id where t.uid=?`,
      [uid]
    );
  } catch (error) {
    throw error;
  }
};

// For Report
txnService._allReportTxnService = async () => {
  try {
    return await pool1.query(
      `SELECT p.username, p.email, amount, type, c.name, description, t.tdate FROM transaction as t INNER JOIN category as c ON t.cid=c.id INNER JOIN profile as p on t.uid=p.id order by p.id, t.tdate DESC`
    );
  } catch (error) {
    throw error;
  }
};

module.exports = txnService;
