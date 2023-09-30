const db = require("../db");

exports.saveBlog = ({ body, file, userId }) => {
  const sql =
    "INSERT INTO blog_post (title, description, image, user_id) VALUES ($1, $2, $3, $4) returning *";
  const values = [body.title, body.description, file?.filename, userId];

  return db.getRow(sql, values);
};

exports.getBlogs = () => {
  const sql =
    "select b.* from blog_post b join cuser c on b.user_id = c.id order by b.id desc";
  return db.getRows(sql, []);
};

exports.editBlog = (body, file) => {
  let sql = "";
  let values = [];
  if (file) {
    sql =
      "UPDATE blog_post SET title = $1, description = $2, image = $3 WHERE id = $4 RETURNING *";
    values = [body.title, body.description, file?.filename, body.id];
  } else {
    sql =
      "UPDATE blog_post SET title = $1, description = $2 WHERE id = $3 RETURNING *";
    values = [body.title, body.description, body.id];
  }

  return db.getRow(sql, values);
};

exports.deleteBlog = (id) => {
  const sql = "delete from blog_post where id = $1";
  return db.execute(sql, [id]);
};

exports.getBlog = (blogId) => {
  const sql =
    "select b.* from blog_post b join cuser c on b.user_id = c.id where b.id = $1";
  return db.getRow(sql, [blogId]);
};
