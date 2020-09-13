const { pool, pool1 } = require('../../config/database');

module.exports = {
  create: (data, callback) => {
    console.log(data);
    pool.query(
      'insert into expense(expensetype, amt ,uid,purpose)values(?,?,?,?)',

      [data.expensetype, data.amt, data.uid, data.purpose],
      (err, results, fields) => {
        if (err) {
          return callback(err);
        } else return callback(null, results);
      }
    );
  },

  getexpense: (userid, expQuery, callback) => {
    let query = 'select * from expense where uid=? ';
    let values = [userid];
    console.log('expQuery : ', expQuery);
    if (expQuery.cond) {
      query += 'and ' + expQuery.cond;
      values.push(...expQuery.values);
    }
    console.log(query, values);
    // if (expensetype) query += ``;
    pool.query(query, values, (err, results, fileds) => {
      if (err) {
        return callback(err);
      } else return callback(null, results);
    });
  },

  getExpenseById: (userid, expid, callback) => {
    pool.query(
      'select * from expense where uid=? and eid=?',
      [userid, expid],
      (err, results, fields) => {
        if (err) {
          return callback(err);
        } else return callback(null, results);
      }
    );
  },

  deleteexpense: (data, callback) => {
    console.log('data : ', data);
    pool.query(
      'delete from expense where eid=? and uid=?',
      [data.eid, data.uid],
      (err, results, fields) => {
        if (err) {
          return callback(err);
        } else return callback(null, results);
      }
    );
  },

  gettotal: async (data) => {
    try {
      const rows = await pool1.query(data.query, [data.uid]);
      console.log(rows);
      return { rows };
    } catch (error) {
      console.log('Error : ', error);
      return {
        error: true,
        message: error.sqlMessage,
        errno: error.errno,
      };
    }
  },
  // gettotalbyWeek: async (data) => {
  //   const rows = await pool.query(
  //     `select expensetype,sum(amt) as total from expense where uid=? and  WEEK(expdate)=WEEK(now()) group by expensetype `,

  //     [data.uid]
  //   );
  //   console.log('Rows : ', rows);
  //   return rows;
  // },
  // gettotalbyMonth: (data, callback) => {
  //   pool.query(
  //     `select expensetype,sum(amt) as total from expense where uid=? and  MONTH(expdate)=MONTH(now()) group by expensetype `,

  //     [data.uid],
  //     (err, results, fields) => {
  //       if (err) {
  //         return callback(err);
  //       } else return callback(null, results);
  //     }
  //   );
  // },
  // gettotalbyYear: (data, callback) => {
  //   pool.query(
  //     `select expensetype,sum(amt) as total from expense where uid=? and  YEAR(expdate)=YEAR(now()) group by expensetype `,

  //     [data.uid],
  //     (err, results, fields) => {
  //       if (err) {
  //         return callback(err);
  //       } else return callback(null, results);
  //     }
  //   );
  // },
};
