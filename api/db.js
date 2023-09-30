const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

exports.pool = pool;

exports.execute = (sql, params) => {
  return pool
    .query(sql, params)
    .then((result) => {
      return result.rowCount > 0;
    })
    .catch((err) => {
      throw err;
    });
};

exports.getRow = (sql, params) => {
  return pool
    .query(sql, params)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

exports.getRows = (sql, params) => {
  return pool
    .query(sql, params)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.query = (sql, params) => {
  return pool
    .query(sql, params)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw err;
    });
};
