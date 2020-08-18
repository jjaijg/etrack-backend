const pool = require("../../config/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `insert into registration(firstname, lastname, gender, email, password, number) values(?,?,?,?,?,?)`,
      [
        data.firstName,
        data.lastName,
        data.gender,
        data.email,
        data.password,
        data.number,
      ],
      (err, results, fields) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, results);
      }
    );
  },
  getUsers: (callBack) => {
    pool.query(
      `select * from registration`,
      [],

      (err, results, fields) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, results);
      }
    );
  },
  getUserById: (id, callBack) => {
    pool.query(
      `select * from registration where id = ?`,
      [id],

      (err, results, fields) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateUser: (data, callBack) => {
    pool.query(
      `update registration set firstname=?, lastname=?, gender=?, email=?, password=?, number=? where id=?`,
      [
        data.firstName,
        data.lastName,
        data.gender,
        data.email,
        data.password,
        data.number,
        data.id,
      ],
      (err, results, fields) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, results[0]);
      }
    );
  },
  deleteUser: (data, callBack) => {
    console.log(data);
    pool.query(
      `delete from registration where id = ?`,
      [data.id],

      (err, results, fields) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByEmail: (email, callBack) => {
    pool.query(
      `select * from registration where email = ?`,
      [email],

      (err, results, fields) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, results);
      }
    );
  },
};
