const router = require("express").Router();
const ApiResponse = require("../model/ApiResponse");
const auth = require("../middleware/auth");
const pageService = require("../service/page");

router.get("/getAbout", (req, res) => {
  console.log(33, req.url);
  pageService
    .getAbout()
    .then((result) => {
      console.log(34, result);
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      console.log(35, err);
      res.status(500).json(new ApiResponse("About page load failed!", null));
    });
});

router.get("/getTerms", (req, res) => {
  pageService
    .getTerms()
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res
        .status(500)
        .json(new ApiResponse("Terms & Condition page load failed!", null));
    });
});

router.get("/getPrivacy", (req, res) => {
  pageService
    .getPrivacy()
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("Privacy page load failed!", null));
    });
});

router.post("/updateAbout", auth, (req, res) => {
  pageService
    .updateAbout(req.body)
    .then((result) => {
      res.status(200).json(new ApiResponse("Successfully updated!", result));
    })
    .catch((err) => {
      res.status(500).json(new ApiResponse("About page update failed!", null));
    });
});

router.post("/updatePrivacy", auth, (req, res) => {
  pageService
    .updatePrivacy(req.body)
    .then((result) => {
      res.status(200).json(new ApiResponse("Successfully updated!", result));
    })
    .catch((err) => {
      res
        .status(500)
        .json(new ApiResponse("Privacy page update failed!", null));
    });
});

router.post("/updateTerms", auth, (req, res) => {
  pageService
    .updateTerms(req.body)
    .then((result) => {
      res.status(200).json(new ApiResponse("Successfully updated!", result));
    })
    .catch((err) => {
      res
        .status(500)
        .json(new ApiResponse("Terms & Condition page update failed!", null));
    });
});

module.exports = router;
