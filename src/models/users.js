const connection = require('../config/mysql');

const {
  filterQueries,
  paginationQueries,
  sortQueries
} = require('../helper');

const allowedFields = ['username', 'email', 'name'];

const selectAllUsers = urlQueries => {
  const queryParams =
    filterQueries(urlQueries, allowedFields) +
    sortQueries(urlQueries) +
    paginationQueries(urlQueries);
  const query = `SELECT * FROM users${queryParams}`;
  return new Promise((resolve, reject) => {
    connection
      .query(query, (error, result) => {
        if (!error) {
          resolve(result);
        }
      })
      .on('error', error => {
        reject(new Error(error));
      });
  });
};

const selectDataUser = id => {
  const query = `SELECT * FROM users WHERE id = ?`;
  return new Promise((resolve, reject) => {
    connection
      .query(query, [id], (error, result) => {
        if (!error) {
          resolve(result);
        }
      })
      .on('error', error => {
        reject(new Error(error));
      });
  });
};

const insertDataUser = data => {
  const query = `INSERT INTO users SET ?`;
  return new Promise((resolve, reject) => {
    connection
      .query(query, [data], (error, result) => {
        if (!error) {
          resolve(result);
        }
      })
      .on('error', error => {
        reject(new Error(error));
      });
  });
};

const updateDataUser = (data, id) => {
  const query = `UPDATE users SET ? WHERE id = ?`;
  return new Promise((resolve, reject) => {
    connection
      .query(query, [data, id], (error, result) => {
        if (!error) {
          resolve(result);
        }
      })
      .on('error', error => {
        reject(new Error(error));
      });
  });
};

const deleteDataUser = id => {
  const query = `DELETE FROM users WHERE id = ?`;
  return new Promise((resolve, reject) => {
    connection
      .query(query, [id], (error, result) => {
        if (!error) {
          resolve(result);
        }
      })
      .on('error', error => {
        reject(new Error(error));
      });
  });
};

const checkUsername = match => {
  const query = `SELECT username FROM users WHERE username = ?`;
  return new Promise((resolve, reject) => {
    connection
      .query(query, [match], (error, result) => {
        if (!error && result[0]) {
          const {username} = result[0];
          if (username === match) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      })
      .on('error', error => {
        reject(error);
      });
  });
};

const checkEmail = match => {
  const query = `SELECT email FROM users WHERE email = ?`;
  return new Promise((resolve, reject) => {
    connection
      .query(query, [match], (error, result) => {
        if (!error && result[0]) {
          const {email} = result[0];
          if (email === match) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      })
      .on('error', error => {
        reject(error);
      });
  });
};

const selectIdUser = (field, match) => {
  const query = `SELECT id FROM users WHERE ${field} = ?`;
  return new Promise((resolve, reject) => {
    connection
      .query(query, [match], (error, result) => {
        if (!error) {
          resolve(result[0]);
        }
      })
      .on('error', error => {
        reject(new Error(error));
      });
  });
};

module.exports = {
  selectAllUsers,
  selectDataUser,
  insertDataUser,
  updateDataUser,
  deleteDataUser,
  selectIdUser,
  checkUsername,
  checkEmail,
};
