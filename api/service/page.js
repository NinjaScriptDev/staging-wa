const db = require("../db");

exports.getAbout = () => {
  const sql = "select * from pages where id = 1";
  return db.getRow(sql, []);
};

exports.getPrivacy = () => {
  const sql = "select * from pages where id = 2";
  return db.getRow(sql, []);
};

exports.getTerms = () => {
  const sql = "select * from pages where id = 3";
  return db.getRow(sql, []);
};

exports.updateAbout = (body) => {
  const sql = "update pages set description = $1 where id = 1 returning *";
  return db.getRow(sql, [body.description]);
};

exports.updatePrivacy = (body) => {
  const sql = "update pages set description = $1 where id = 2 returning *";
  return db.getRow(sql, [body.description]);
};

exports.updateTerms = (body) => {
  const sql = "update pages set description = $1 where id = 3 returning *";
  return db.getRow(sql, [body.description]);
};
