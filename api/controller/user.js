const router = require("express").Router();
const userService = require("../service/user");
const ApiResponse = require("../model/ApiResponse");
const auth = require("../middleware/auth");
const { uploadUser } = require("../middleware/upload");
const CustomError = require("../model/CustomError");

router.post("/register", (req, res) => {
  userService
    .register(req.body)
    .then((result) => {
      if (result?.newFriendsCount && result?.authData?.token) {
        res
          .status(201)
          .header("authorization", result.authData.token)
          .json(
            new ApiResponse("Registration successful!", {
              newFriendsCount: result.newFriendsCount,
              currentUser: result.authData.currentUser,
            })
          );
      } else if (result?.authData?.token) {
        res
          .status(201)
          .header("authorization", result.authData.token)
          .json(
            new ApiResponse("Registration successful!", {
              currentUser: result.authData.currentUser,
            })
          );
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      if (err.code == "23505")
        res.status(500).json(new ApiResponse("Email already taken!", null));
      else res.status(500).json(new ApiResponse("Registration failed!", null));
    });
});

router.post("/signin", (req, res) => {
  userService
    .signin(req.body)
    .then(({ token, currentUser }) => {
      if (token) {
        res
          .status(200)
          .header("authorization", token)
          .json(new ApiResponse("Sign in successful!", { currentUser }));
      } else {
        res
          .status(401)
          .json(new ApiResponse("Incorrect email/password!", null));
      }
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Sign in failed!", null));
    });
});

router.get("/getUserById", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;

  userService
    .getUserById(userId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse(null, null));
    });
});

router.get("/searchUser", auth, (req, res) => {
  const requestedUser = req.query?.requestedUser;

  userService
    .searchUser(requestedUser)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("No user found!", null));
    });
});

router.get("/deleteUser", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;

  userService
    .deleteUser(userId)
    .then((result) => {
      if (result) {
        res
          .status(200)
          .json(new ApiResponse("User deleted successfully!", result));
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Deleting user failed!", null));
    });
});

router.get("/getFriends", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;

  userService
    .getFriends(userId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res
        .status(500)
        .json(new ApiResponse("Loading friend list failed!", null));
    });
});

router.get("/removeFriend", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;
  const friendshipId = req.query?.friendshipId;

  userService
    .removeFriend(userId, friendshipId)
    .then((result) => {
      if (result) {
        res
          .status(200)
          .json(new ApiResponse("Removed from friend list!", result));
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Removing friend failed!", null));
    });
});

router.post("/updateProfile", auth, uploadUser.single("file"), (req, res) => {
  const userId = req.currentUser.id;
  userService
    .updateProfile({ body: req.body, file: req.file, userId })
    .then((result) => {
      res
        .status(200)
        .json(new ApiResponse("Profile updated successfully!", result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Profile update failed!", null));
    });
});

router.post("/sendInvite", auth, (req, res) => {
  const userId = req.currentUser.id;
  userService
    .sendInvite(req.body, userId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      if (err instanceof CustomError) {
        if (err.statusCode === 409)
          res.status(200).json(new ApiResponse(null, err.payload));
        else
          res.status(err.statusCode).json(new ApiResponse(err.message, null));
      } else {
        res
          .status(500)
          .json(new ApiResponse("Invitation sending failed!", null));
      }
    });
});

router.get("/acceptInvite", (req, res) => {
  const invitationId = req.query?.id;
  const token = req.query?.token;

  let clientUrl = process.env.BASE_VUE_URL;
  let apiQueryMsg = "";
  userService
    .acceptInvite(invitationId, token)
    .then((result) => {
      if (result.redirect === "friends") {
        apiQueryMsg = "Friend invitation accepted!";
        clientUrl += "/friends";
        res.redirect(301, `${clientUrl}?apiQueryMsg=${apiQueryMsg}`);
      } else if (result.redirect === "register") {
        apiQueryMsg = "Friend invitation will be accepted after registration!";
        clientUrl += "/register";
        res.redirect(301, `${clientUrl}?apiQueryMsg=${apiQueryMsg}`);
      }
    })
    .catch((err) => {
      clientUrl += "/register";
      if (err instanceof CustomError) {
        apiQueryMsg = err.message;
        res.redirect(301, `${clientUrl}?apiQueryMsg=${apiQueryMsg}`);
      } else {
        apiQueryMsg = "Invitation accepting failed!";
        res.redirect(301, `${clientUrl}?apiQueryMsg=${apiQueryMsg}`);
      }
    });
});

module.exports = router;
