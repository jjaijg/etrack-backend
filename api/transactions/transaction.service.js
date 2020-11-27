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
    const { uid, cid, description, type, amount } = newTxn;

    const isTxnAdded = await pool1.query(
      `insert into transaction(uid, cid, amount, type, description) values(?,?,?,?,?)`,
      [uid, cid, amount, type, description]
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
    const { uid, cid, type, description, amount } = updTxn;

    return await pool1.query(
      `update transaction set cid=?, amount=?, type=?, description=?, updatedAt=CURRENT_TIMESTAMP() where id=? and uid=?`,
      [cid, amount, type, description, id, uid]
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
    return await pool1.query(`select * from transaction where uid=?`, [uid]);
  } catch (error) {
    throw error;
  }
};

module.exports = txnService;
