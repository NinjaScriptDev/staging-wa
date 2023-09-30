require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const customCors = require("./middleware/customCors");
const port = process.env.PORT || 3001;

//middlewares
app.use(customCors);
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());

app.listen(port, (err) => {
  if (err) return console.error(err);
  console.log(`Server started at ${port}`);
});

//routes
app.use("/api/user", require("./controller/user"));
app.use("/api/event", require("./controller/event"));
app.use("/api/category", require("./controller/category"));
app.use("/api/page", require("./controller/page"));
app.use("/api/blog", require("./controller/blog"));
