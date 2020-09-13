const {
  create,
  getexpense,
  deleteexpense,
  getExpenseById,
  gettotal,
} = require('./expense.service');
const { buildExpenseQuery } = require('../utility/expenseutilities');

module.exports = {
  createxpense: (req, res) => {
    let body = req.body;
    const { user } = req;
    console.log(user);
    body.uid = user.id;
    console.log(body);
    create(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'database connection error',
        });
      } else
        return res.status(200).json({
          success: 1,
          data: results,
        });
    });
  },
  getexpense: (req, res) => {
    const query = req.query;
    console.log(query);
    const user = req.user;
    console.log('users', user);
    //check queries string

    const expQuery = buildExpenseQuery(query); //{cond: "", values:[]}

    getexpense(user.id, expQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Internal Server Error',
        });
      }
      if (!result) {
        return res.json({
          success: 0,
          message: 'Record not found',
        });
      }
      return res.json({
        success: 1,
        data: result,
        message: 'Expenses found',
      });
    });
  },
  getExpenseById: (req, res) => {
    const id = req.params.id;
    const userid = req.user.id;

    getExpenseById(userid, id, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (!result) {
        return res.json({
          success: 0,
          message: 'Record not found',
        });
      }
      return res.json({
        success: 1,
        data: result,
      });
    });
  },

  deleteexpense: (req, res) => {
    const { body } = req;
    console.log(body, req.body);
    body.uid = req.user.id;
    deleteexpense(body, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
      if (result.affectedRows) {
        return res.json({
          success: 1,
          message: 'Expense deleted Succesfully',
        });
      } else {
        return res.status(404).json({
          success: 0,
          message: 'Expense details not found!',
        });
      }
    });
  },

  gettotalexpense: async (req, res) => {
    let expenseTotals = {};
    let data = {};
    data.uid = req.user.id;
    data.query = `select expensetype,sum(amt) as total from expense where uid=? and  DATE(expdate)=CURDATE() group by expensetype `;
    const result = await gettotal(data);
    if (!result.error) {
      expenseTotals.today = result.rows;
    }
    if (expenseTotals.today) {
      data.query = `select expensetype,sum(amt) as total from expense where uid=? and  WEEK(expdate)=WEEK(now()) group by expensetype `;
      const result1 = await gettotal(data);
      if (!result1.error) {
        expenseTotals.week = result.rows;
      }
    }
    if (expenseTotals.week) {
      data.query = `select expensetype,sum(amt) as total from expense where uid=? and  MONTH(expdate)=MONTH(now()) group by expensetype `;
      const result1 = await gettotal(data);
      if (!result1.error) {
        expenseTotals.month = result.rows;
      }
    }
    if (expenseTotals.month) {
      data.query = `select expensetype,sum(amt) as total from expense where uid=? and  YEAR(expdate)=YEAR(now()) group by expensetype `;
      const result1 = await gettotal(data);
      if (!result1.error) {
        expenseTotals.year = result.rows;
      }
    }
    if (!expenseTotals.year) {
      return res.status(500).json({
        success: 0,
        message: 'database issue',
      });
    }
    return res.json({
      success: 1,
      data: expenseTotals,
    });
  },
};
