const checkExpenseType = (query) => {
  if (query.expensetype) {
    return {
      cond: 'expensetype=? ',
      value: [query.expensetype],
    };
  }
  return '';
};

const checkExpenseAmount = (query) => {
  if (query.samount) {
    return {
      cond: '(amt>=? and amt<=?) ',
      value: [query.samount, query.eamount],
    };
  }
  return '';
};

const checkExpenseDate = (query) => {
  if (query.sdate) {
    if (query.sdate.toLowerCase() == 'today') {
      return {
        cond: 'DATE(expdate)=CURDATE()',
        value: [],
      };
    }
    if (query.sdate.toLowerCase() == 'month') {
      return {
        cond: '(MONTH(expdate)=MONTH(now()))',
        value: [],
      };
    } else if (query.sdate.toLowerCase() == 'year') {
      return {
        cond: '(YEAR(expdate) = YEAR(now()))',
        value: [],
      };
    } else if (query.sdate.toLowerCase() == 'week') {
      return {
        cond: '(WEEK(expdate) = WEEK(now()))',
        value: [],
      };
    }
  }
  return '';
};

/*const checkExpenseDate = (query) => {
  if (query.expdate) {
    let expensequery = '';

    switch (expensequery) {
      case 'Month':
        cond: '(MONTH(expdate)=MONTH.now())';
        value: [query.expdate];
        break;

      case 'Year':
        cond: '(YEAR(expdate)=YEAR.now())';
        value: [query.expdate];
        break;
    }
  }
  return '';
};
*/

// checExpkData
/*
let expquery =''
today, week, monnth, year
expensquery += 'month(expdate)


*/

const buildExpenseQuery = (query) => {
  let cond = '';
  let values = [];
  const checktype = checkExpenseType(query);
  const checkamount = checkExpenseAmount(query);
  const checkexpdate = checkExpenseDate(query);

  if (checktype) {
    cond += checktype.cond;
    values.push(...checktype.value); // [income]
  }

  if (checkamount) {
    cond += checktype ? 'and ' + checkamount.cond : checkamount.cond;
    values.push(...checkamount.value); //[10, 100]
  }

  if (checkexpdate) {
    cond +=
      checktype || checkamount ? 'and ' + checkexpdate.cond : checkexpdate.cond;
    values.push(...checkexpdate.value);
  }

  return {
    cond,
    values,
  };
};
module.exports = { buildExpenseQuery };
