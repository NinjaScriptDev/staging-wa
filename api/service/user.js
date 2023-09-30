const db = require("../db");
// const { pool } = require("../db");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../model/CustomError");

const generateAuthData = (result) => {
  let token = "";
  let currentUser = {};
  if (result) {
    currentUser = {
      id: result.id,
      role: result.role === 1 ? "user" : "admin",
      name: result.full_name,
      image: result.image,
    };
    token = jwt.sign({ currentUser }, process.env.TOKEN_SECRET);
  }
  return { token, currentUser };
};

const bulkInsertFriendships = async (records) => {
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN"); // Start a transaction

    for (const record of records) {
      // Use a parameterized query for the bulk insert
      await db.pool.query(
        "INSERT INTO friendship (user_id_1, user_id_2) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [record.user_id_1, record.user_id_2]
      );
    }

    await client.query("COMMIT"); // Commit the transaction
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback the transaction on error
    throw error; // Rethrow the error for handling in the calling function
  } finally {
    client.release(); // Release the client back to the pool
  }
};

const bulkDeleteInvitations = async (invitationIds) => {
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN"); // Start a transaction

    const queryText = "DELETE FROM invitation WHERE id = ANY($1)";
    // Use the :csv format to pass an array of values as a single parameter
    await client.query(queryText, [invitationIds]);

    await client.query("COMMIT"); // Commit the transaction
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback the transaction on error
    throw error; // Rethrow the error for handling in the calling function
  } finally {
    client.release(); // Release the client back to the pool
  }
};

exports.getPendingInvitation = (email) => {
  const sql =
    "select * from invitation where receiver_email = $1 and is_accepted = true";
  return db.getRows(sql, [email]);
};

exports.register = async (payload) => {
  try {
    // Insert user into cuser table and retrieve user data
    const sql =
      "INSERT INTO cuser (full_name, email, password, date_of_birth, country, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name, image, email, role;";
    const userResult = await db.getRow(sql, [
      payload.fullName,
      payload.email,
      payload.password,
      payload.dateOfBirth,
      payload.country,
      1,
    ]);

    // Generate authentication data
    const authData = generateAuthData(userResult);
    const userId = userResult.id;

    // Get pending invitations for the registered user
    const pendingInvitations = await exports.getPendingInvitation(
      userResult.email
    );

    const pendingInvitationIds = pendingInvitations.map((item) => item.id);

    // Prepare friendship records for bulk insertion
    const friendshipRecords = pendingInvitations.map((item) => ({
      user_id_1: userId,
      user_id_2: item.sender_id,
    }));

    // Use Promise.all for concurrent execution of database operations
    await Promise.all([
      // Bulk insert friendships
      bulkInsertFriendships(friendshipRecords),
      // Bulk delete invitations by IDs
      bulkDeleteInvitations(pendingInvitationIds),
    ]);

    return friendshipRecords.length > 0
      ? { newFriendsCount: friendshipRecords.length, authData }
      : { authData };
  } catch (err) {
    throw err;
  }
};

exports.signin = (payload) => {
  const sql =
    "select id, full_name, image, email, password, role from cuser where email = $1 and password = $2";
  return db
    .getRow(sql, [payload.email, payload.password])
    .then((result) => {
      return generateAuthData(result);
    })
    .catch((err) => {
      throw err;
    });
};

exports.getUserById = (userId) => {
  const sql =
    "select id, full_name, email, date_of_birth, country, image, created_at from cuser where id = $1";
  return db.getRow(sql, [userId]);
};

exports.getIdByEmail = (email) => {
  const sql = "select id from cuser where email = $1";
  return db.getRow(sql, [email]);
};

exports.checkFriends = (id1, id2) => {
  const sql =
    "select id from friendship where (user_id_1 = $1 and user_id_2 = $2) or (user_id_1 = $2 and user_id_2 = $1)";
  return db.getRow(sql, [id1, id2]);
};

exports.sendInvite = (body, userId) => {
  let receiver_id = null;
  let sender_id = userId;

  //check if ivnitation sent already
  const sql =
    "select * from invitation where sender_id = $1 and receiver_email = $2";
  return db
    .getRow(sql, [userId, body.email])
    .then((result) => {
      if (result?.id) {
        throw new CustomError("Already sent invitaion!", 409, result);
      }
      //find receiver's id from email
      return exports.getIdByEmail(body.email);
    })
    .then((result) => {
      // if email exist
      if (result?.id) {
        receiver_id = result.id;
        //check if they are friends
        return exports.checkFriends(receiver_id, sender_id);
      }
    })
    .then((result) => {
      // if they are friends already
      if (result) {
        throw new CustomError("User already in friendlist!");
      }
      //if not insert in invitation
      else {
        //generate token
        const token = uuidv4();
        const sql =
          "insert into invitation (sender_id, receiver_id, receiver_email, token, is_accepted) values ($1, $2, $3," +
          " $4, $5) returning *";
        return db.getRow(sql, [
          sender_id,
          receiver_id,
          body.email,
          token,
          false,
        ]);
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.acceptInvite = (invitationId, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "select * from invitation where id = $1 and token = $2";
      const invitation = await db.getRow(sql, [invitationId, token]);

      //if valid invitation & if receiver id exist then no need to register
      if (invitation && invitation.receiver_id) {
        //  check if friends and throw err
        const areFriends = await exports.checkFriends(
          invitation.sender_id,
          invitation.receiver_id
        );

        if (areFriends) {
          throw new CustomError("Already friends!");
        }

        //  insert into friendship
        const sql2 =
          "insert into friendship (user_id_1, user_id_2) values($1, $2)";
        const friendship = await db.execute(sql2, [
          invitation.sender_id,
          invitation.receiver_id,
        ]);

        //  delete record from invitation by id
        const sql3 = "delete from invitation where id = $1";
        await db.execute(sql3, [invitation.id]);

        //  redirect to friends page
        resolve({ redirect: "friends" });
      }
      //if valid invitation & if receiver id doesn't exist
      else if (invitation) {
        //  update invitation with is_accepted=true where reciever_id=null,
        const sql =
          "update invitation set is_accepted = true where id = $1 and receiver_id is null";
        await db.execute(sql, [invitation.id]);
        //  redirect to register page
        resolve({ redirect: "register" });
      }
      //invalid invitation
      else {
        throw new CustomError("Invalid invitation!");
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getFriends = (userId) => {
  const sql =
    "select f.id as friendship_id, c.id, c.full_name, c.image from cuser c join (select id, user_id_1 as friend_id," +
    " created_at from friendship where user_id_2 = $1 union select id, user_id_2 as friend_id, created_at from" +
    " friendship where user_id_1 = $1) as f on c.id = f.friend_id order by f.created_at desc";
  return db.getRows(sql, [userId]);
};

exports.removeFriend = (userId, friendshipId) => {
  const sql =
    "delete from friendship where id = $1 and (user_id_1 = $2 or user_id_2 = $2 )";
  return db.execute(sql, [friendshipId, userId]);
};

exports.searchUser = (requestedUser) => {
  const sql =
    "SELECT id, full_name, email, date_of_birth, country, image FROM cuser WHERE (id::text = $1 OR LOWER(full_name) LIKE" +
    " '%' || LOWER($2) || '%' OR LOWER(email) = LOWER($2))";
  return db.getRows(sql, [requestedUser, requestedUser]);
};

exports.deleteUser = (userId) => {
  const sql1 = "DELETE FROM event_favorite WHERE user_id = $1;";
  const sql2 = "DELETE FROM event_comment WHERE user_id = $1;";
  const sql3 = "DELETE FROM event_wishlist WHERE user_id = $1;";
  const sql4 = "DELETE FROM event_post WHERE user_id = $1;";
  const sql5 = "DELETE FROM friendship WHERE user_id_1 = $1 OR user_id_2 = $1;";
  const sql6 = "delete from cuser where id = $1";

  return db
    .execute(sql1, [userId])
    .then((result) => {
      return db.execute(sql2, [userId]);
    })
    .then((result) => {
      return db.execute(sql3, [userId]);
    })
    .then((result) => {
      return db.execute(sql4, [userId]);
    })
    .then((result) => {
      return db.execute(sql5, [userId]);
    })
    .then((result) => {
      return db.execute(sql6, [userId]);
    })
    .catch((err) => {
      throw err;
    });
};

exports.updateProfile = ({ body, file, userId }) => {
  let sql = "UPDATE cuser SET";
  const values = [];
  const columns = [];
  if (body.full_name !== undefined) {
    columns.push("full_name");
    values.push(body.full_name);
  }
  if (body.email !== undefined) {
    columns.push("email");
    values.push(body.email);
  }
  if (body.password !== undefined) {
    columns.push("password");
    values.push(body.password);
  }
  if (file) {
    columns.push("image");
    values.push(file.filename);
  }
  sql += " " + columns.map((col, index) => `${col} = $${index + 1}`).join(", ");
  values.push(userId);
  sql += ` WHERE id = $${values.length} RETURNING full_name, email, image;`;

  return db.getRow(sql, values);
};
