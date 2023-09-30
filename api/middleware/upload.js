const multer = require("multer");
const path = require("path");

const storageEvent = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = path.join(__dirname, "..", "public", "event");
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + name + path.extname(file.originalname));
  },
});
const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = path.join(__dirname, "..", "public", "user");
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + name + path.extname(file.originalname));
  },
});
const storageBlog = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = path.join(__dirname, "..", "public", "blog");
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + name + path.extname(file.originalname));
  },
});

const uploadEvent = multer({ storage: storageEvent });
const uploadUser = multer({ storage: storageUser });
const uploadBlog = multer({ storage: storageBlog });

module.exports = { uploadEvent, uploadUser, uploadBlog };
