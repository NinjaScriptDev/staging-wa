const cors = require("cors");

const excludedUrls = ["/api/user/acceptInvite"];

const corsOptions = {
  origin: process.env.BASE_VUE_URL,
  exposedHeaders: "authorization",
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

function customCors(req, res, next) {
  console.log(1, req.url, process.env.BASE_VUE_URL);
  const isExcluded = excludedUrls.some((url) => {
    req.originalUrl.includes(url);
  });

  if (isExcluded) {
    console.log(2, isExcluded);
    return next();
  }

  return corsMiddleware(req, res, next);
}

module.exports = customCors;
