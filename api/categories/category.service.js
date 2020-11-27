const { pool1 } = require('../../config/database');

const ERR_MESSAGE = 'Internal server error, please try again!';
const catService = {};

catService.getCatByIdService = async (id, uid) => {
  try {
    return await pool1.query(
      `select * from category where id = ? and (uid=? or uid is NULL)`,
      [id, uid]
    );
  } catch (error) {
    throw error;
  }
};

catService.createCatService = async (data) => {
  try {
    const isCatAdded = await pool1.query(
      `insert into category(uid, name) values(?, ?)`,
      [data.uid, data.name]
    );
    if (isCatAdded.affectedRows) {
      return await catService.getCatByIdService(isCatAdded.insertId, data.uid);
    } else {
      throw new Error(ERR_MESSAGE);
    }
  } catch (error) {
    throw error;
  }
};

catService.updateCatService = async (data) => {
  try {
    const isUpdated = await pool1.query(
      `update category set name=? where id=? and uid=?`,
      [data.name, data.id, data.uid]
    );

    if (isUpdated.affectedRows) {
      return await catService.getCatByIdService(data.id, data.uid);
    } else {
      throw new Error('Error while updating the category / Category not found');
    }
  } catch (error) {
    throw error;
  }
};

catService.deleteCatService = async (data) => {
  try {
    const rows = await pool1.query(data.query, [data.cid, data.uid]);
    console.log(rows);
    return { ...rows };
  } catch (error) {
    console.log('Error : ', error);
    return {
      error: true,
      sqlMessage: error.sqlMessage,
      errno: error.errno,
    };
  }
};

catService.getUserCatService = async (uid) => {
  try {
    const userCats = await pool1.query(`select * from category where uid = ?`, [
      uid,
    ]);
    return userCats;
  } catch (error) {
    throw error;
  }
};

catService.getDefaultCatService = async () => {
  try {
    const defaultCats = await pool1.query(
      `select * from category where uid is NULL`
    );
    return defaultCats;
  } catch (error) {
    throw error;
  }
};

catService.getAllCatService = async (uid) => {
  try {
    const allCats = await pool1.query(
      `select * from category where uid = ? or uid is NULL`,
      [uid]
    );
    return allCats;
  } catch (error) {
    throw error;
  }
};

module.exports = catService;
