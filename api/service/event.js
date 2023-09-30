const db = require("../db");
const CustomError = require("../model/CustomError");

exports.saveEvent = ({ body, files, userId }) => {
  const fileNames = files?.map((file) => file.filename) || [];
  const sql =
    "INSERT INTO event_post (title, date, start_time, end_time, location, description, category, images," +
    " is_featured, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *";
  const values = [
    body.title,
    body.date,
    body.start_time,
    body.end_time,
    body.location,
    body.description,
    body.category,
    fileNames,
    body.is_featured,
    userId,
  ];

  return db.getRow(sql, values);
};

exports.getEventsByUserId = (userId) => {
  const sql =
    "select e.* from event_post e join cuser c on e.user_id = c.id where e.user_id = $1 order by e.id desc";
  return db.getRows(sql, [userId]);
};

exports.getEvent = (eventId) => {
  const sql =
    "select e.*, c.full_name, c.image from event_post e join cuser c on e.user_id = c.id where e.id = $1";
  return db.getRow(sql, [eventId]);
};

exports.getCommentsByEventId = (eventId) => {
  const sql =
    "SELECT ec.id, ec.user_id, ec.text, ec.created_at, u.full_name, u.image FROM event_comment ec JOIN cuser u ON" +
    " ec.user_id =" +
    " u.id WHERE ec.event_id = $1 order by ec.created_at desc;";
  return db.getRows(sql, [eventId]);
};

exports.setCommentsByEventId = (newComment, userId) => {
  const sql =
    "INSERT INTO event_comment (event_id, user_id, text) VALUES ($1, $2, $3) returning *";
  const values = [newComment.event_id, userId, newComment.text];
  return db.getRow(sql, values);
};

exports.deleteComment = (commentId, userId, userRole) => {
  let sql = "delete from event_comment where id = $1";
  let values = [commentId];

  // if not admin add constraint
  if (userRole !== "admin") {
    sql += "and user_id = $2";
    values.push(userId);
  }
  return db.execute(sql, values);
};

exports.deleteEvent = (eventId, userId, userRole) => {
  let sql = "delete from event_post where id = $1";
  let values = [eventId];

  // if not admin add constraint
  if (userRole !== "admin") {
    sql += "and user_id = $2";
    values.push(userId);
  }
  return db.execute(sql, values);
};

exports.deleteWishlistEvent = (eventId, userId, userRole) => {
  let sql = "delete from event_wishlist where id = $1";
  let values = [eventId];

  // if not admin add constraint
  if (userRole !== "admin") {
    sql += "and user_id = $2";
    values.push(userId);
  }
  return db.execute(sql, values);
};

exports.getFavoriteEvents = (userId) => {
  const sql =
    "select e.*, c.full_name, c.image from event_post e join event_favorite ef on e.id = ef.event_id join cuser c on" +
    " c.id = e.user_id where ef.user_id = $1 order by ef.created_at desc";
  return db.getRows(sql, [userId]);
};

exports.getWishlistEvents = (userId) => {
  const sql =
    "select * from event_wishlist where user_id = $1 order by created_at desc";
  return db.getRows(sql, [userId]);
};

exports.getWishlistEvent = (eventId) => {
  const sql =
    "select ew.*, c.full_name, c.image from event_wishlist ew join cuser c on ew.user_id = c.id where ew.id = $1";
  return db.getRow(sql, [eventId]);
};

exports.addWishlistEvent = ({ body, userId }) => {
  const { title, location, description, category } = body;
  const sql =
    "INSERT INTO event_wishlist (title, location, description, category, user_id) VALUES ($1, $2, $3, $4, $5)" +
    " returning *";
  const values = [title, location, description, category, userId];

  return db.getRow(sql, values);
};

exports.addFavoriteEvent = (userId, eventId) => {
  //check for duplicates
  return db
    .getRow(
      "select * from event_favorite where user_id = $1 and event_id = $2",
      [userId, eventId]
    )
    .then((res) => {
      if (res) {
        return Promise.reject(new CustomError("Already added to favorite!"));
      } else {
        const sql =
          "insert into event_favorite(user_id, event_id) values($1, $2)";
        return db.execute(sql, [userId, eventId]);
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.getAllEventsByFriends = (userId) => {
  const sql =
    "select e.*, c.full_name, c.image from event_post e " +
    "join (select user_id_1 as friend_id from friendship where user_id_2 = $1" +
    " union select user_id_2 as friend_id from friendship where user_id_1 = $1" +
    " union select $1 as friend_id) as friends on e.user_id = friends.friend_id" +
    " join cuser c on e.user_id = c.id order by e.date desc";
  return db.getRows(sql, [userId]);
};

exports.getUpcomingEvents = (userId, source) => {
  let friends = [];
  const sql =
    "SELECT user_id_1 AS friend_id FROM friendship WHERE user_id_2 = $1 UNION SELECT user_id_2 AS friend_id FROM" +
    " friendship WHERE user_id_1 = $2";

  const sql2 =
    "select e.*, c.full_name, c.image from event_post e join cuser c on e.user_id = c.id where e.user_id =" +
    " ANY($1::int[]) and e.date >= CURRENT_DATE order by e.date limit 3";

  if (source === "friends") {
    return db
      .getRows(sql, [userId, userId])
      .then((res) => {
        friends = res.map((item) => parseInt(item.friend_id));

        return db.getRows(sql2, [friends]);
      })
      .catch((err) => {
        throw err;
      });
  } else {
    friends.push(parseInt(userId));

    return db.getRows(sql2, [friends]);
  }
};

exports.findEvents = (userId, offset, startDate, endDate, category) => {
  const sql =
    "select e.*, c.full_name, c.image from event_post e join cuser c on e.user_id = c.id where e.user_id = $1 and e.date between $2 and $3 and e.category = $4 order by e.id desc";
  return db.getRows(sql, [userId, startDate, endDate, category]);
};

exports.getFeaturedEvent = (userId) => {
  const sql =
    "select * from event_post where user_id = $1 and is_featured = true";
  return db.getRow(sql, [userId]);
};

exports.setFeaturedEvent = (value, eventId, userId) => {
  const sql =
    "update event_post set is_featured = $1 where id = $2 and user_id = $3";
  return db.execute(sql, [value, eventId, userId]);
};

exports.setEventNotification = (eventId, payload) => {
  const sql = "update event_post set new_notification = $1 where id = $2";
  return db.execute(sql, [payload, eventId]);
};
