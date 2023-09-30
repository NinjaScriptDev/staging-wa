const router = require("express").Router();
const eventService = require("../service/event");
const { uploadEvent } = require("../middleware/upload");
const auth = require("../middleware/auth");
const ApiResponse = require("../model/ApiResponse");
const CustomError = require("../model/CustomError");

router.post("/save", auth, uploadEvent.any(), (req, res) => {
  const userId = req.currentUser.id;

  eventService
    .saveEvent({ body: req.body, files: req.files, userId })
    .then((result) => {
      res
        .status(200)
        .json(new ApiResponse("Event created successfully!", result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event creation failed!", null));
    });
});

router.get("/getEventsByUserId", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;
  eventService
    .getEventsByUserId(userId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event loading failed!", null));
    });
});

router.get("/getEvent", auth, (req, res) => {
  const eventId = req.query?.eventId;
  eventService
    .getEvent(eventId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event loading failed!", null));
    });
});

router.get("/getCommentsByEventId", auth, (req, res) => {
  const eventId = req.query?.eventId;
  eventService
    .getCommentsByEventId(eventId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Comment loading failed!", null));
    });
});

router.get("/deleteComment", auth, (req, res) => {
  const commentId = req.query?.commentId;
  eventService
    .deleteComment(commentId, req.currentUser.id, req.currentUser.role)
    .then((result) => {
      if (result)
        res
          .status(200)
          .json(new ApiResponse("Comment deleted successfuly!", result));
      else throw new Error();
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Comment deleting failed!", null));
    });
});

router.get("/deleteEvent", auth, (req, res) => {
  const eventId = req.query?.eventId;
  eventService
    .deleteEvent(eventId, req.currentUser.id, req.currentUser.role)
    .then((result) => {
      if (result)
        res
          .status(200)
          .json(new ApiResponse("Event deleted successfuly!", result));
      else throw new Error();
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event deleting failed!", null));
    });
});

router.get("/deleteWishlistEvent", auth, (req, res) => {
  const eventId = req.query?.eventId;
  eventService
    .deleteWishlistEvent(eventId, req.currentUser.id, req.currentUser.role)
    .then((result) => {
      if (result)
        res
          .status(200)
          .json(new ApiResponse("Event deleted successfuly!", result));
      else throw new Error();
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event deleting failed!", null));
    });
});

router.post("/setCommentsByEventId", auth, (req, res) => {
  eventService
    .setCommentsByEventId(req.body, req.currentUser.id)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Comment loading failed!", null));
    });
});

router.get("/addFavoriteEvent", auth, (req, res) => {
  const eventId = req.query?.eventId;

  eventService
    .addFavoriteEvent(req.currentUser.id, eventId)
    .then((result) => {
      res.status(200).json(new ApiResponse("Added to favorite!", result));
    })
    .catch((err) => {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json(new ApiResponse(err.message, null));
      } else {
        res
          .status(500)
          .json(new ApiResponse("Adding to favorite failed!", null));
      }
    });
});

router.get("/getFavoriteEvents", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;
  eventService
    .getFavoriteEvents(userId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event loading failed!", null));
    });
});

router.get("/getWishlistEvents", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;
  eventService
    .getWishlistEvents(userId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event loading failed!", null));
    });
});

router.get("/getWishlistEvent", auth, (req, res) => {
  const eventId = req.query?.eventId;
  eventService
    .getWishlistEvent(eventId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event loading failed!", null));
    });
});

router.post("/addWishlistEvent", auth, uploadEvent.any(), (req, res) => {
  eventService
    .addWishlistEvent({ body: req.body, userId: req.currentUser.id })
    .then((result) => {
      res
        .status(200)
        .json(new ApiResponse("Event created successfully!", result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event creation failed!", null));
    });
});

router.get("/getAllEventsByFriends", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;
  eventService
    .getAllEventsByFriends(userId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event loading failed!", null));
    });
});

router.get("/getUpcomingEvents", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;
  const source = req.query?.source;
  eventService
    .getUpcomingEvents(userId, source)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event loading failed!", null));
    });
});

router.get("/findEvents", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;
  eventService
    .findEvents(
      userId,
      req.query?.offset,
      req.query?.startDate,
      req.query?.endDate,
      req.query?.category
    )
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Event loading failed!", null));
    });
});

router.get("/getFeaturedEvent", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;
  eventService
    .getFeaturedEvent(userId)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Action failed!", null));
    });
});

router.get("/setEventNotification", auth, (req, res) => {
  const eventId = req.query?.eventId;
  const payload = req.query?.payload;
  const userId = req.query?.userId || req.currentUser.id;
  eventService
    .setEventNotification(eventId, payload)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Action failed!", null));
    });
});

router.get("/setFeaturedEvent", auth, (req, res) => {
  const userId = req.query?.userId || req.currentUser.id;

  eventService
    .setFeaturedEvent(true, req.query.newEventId, userId)
    .then((result) => {
      if (!result) {
        throw new Error();
      } else if (req.query.oldEventId) {
        //if featured event set already, set it to false
        return eventService.setFeaturedEvent(
          false,
          req.query.oldEventId,
          userId
        );
      } else {
        //no featured event set previously, send res right after setting new featured event to true
        return true;
      }
    })
    .then((result) => {
      if (!result) {
        throw new Error();
      } else {
        res.status(200).json(new ApiResponse(null, result));
      }
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Action failed!", null));
    });
});

module.exports = router;
