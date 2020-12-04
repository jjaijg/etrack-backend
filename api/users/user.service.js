const { pool, pool1 } = require('../../config/database');

const ERR_MESSAGE = 'Internal server error, please try again!';
const userService = {};

userService.getUserByIdService = async (id) => {
  try {
    const user = await pool1.query(
      `select id, username, email, phone, createdAt, activated from profile where id = ?`,
      [id]
    );
    if (user.length) {
      return user[0];
    }
    throw new Error('Error in gettting user details');
  } catch (error) {
    throw error;
  }
};

userService.getUserByEmail = async (email) => {
  try {
    const user = await pool1.query(`select * from profile where email = ?`, [
      email,
    ]);
    return user.length ? user[0] : null;
  } catch (error) {
    throw error;
  }
};

userService.createUserService = async (data) => {
  try {
    const isUserAdded = await pool1.query(
      `insert into profile(username, email, password, phone) values(?,?,?,?)`,
      [data.username, data.email, data.password, data.phone]
    );
    if (isUserAdded.affectedRows) {
      return await userService.getUserByIdService(isUserAdded.insertId);
    } else {
      throw new Error(ERR_MESSAGE);
    }
  } catch (error) {
    throw error;
  }
};

userService.getUsers = (callBack) => {
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
};

userService.getUserById = (id) => {
  pool1.query(`select * from profile where id = ?`, [id]);
};

userService.updateUser = async (user) => {
  try {
    const isUserUpdated = await pool1.query(
      `update profile set username=?, phone=? where id=?`,
      [user.username, user.phone, user.id]
    );
    return isUserUpdated;
  } catch (error) {
    throw error;
  }
};

userService.deleteUser = (data, callBack) => {
  pool.query(
    `delete from registration where id = ?`,
    [data],

    (err, results, fields) => {
      if (err) {
        return callBack(err);
      }
      return callBack(null, results[0]);
    }
  );
};

module.exports = userService;
