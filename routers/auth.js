const { createUser, updateUser, updateFile } = require("../src/api");
const _ = require("lodash");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    let format = "";
    switch (file.fieldname) {
      case "avatar": {
        format = ".png";
        break;
      }
      case "cv": {
        format = ".pdf";
        break;
      }
      default:
        format = "";
    }

    cb(null, file.fieldname + "-" + Date.now() + format);
  },
});

let upload = multer({ storage: storage });
const express = require("express");
const router = express.Router();
router.route("/user").post(createUser).patch(updateUser);
router.patch(
  "/user/upload",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  (req, res, next) => {
    let files = req.files;
    let locateFileUpload = {};
    if (files["cv"]) {
      console.log(files["cv"]);
      locateFileUpload = {
        ...locateFileUpload,
        cv: `/uploads/${files["cv"][0]["filename"]}`,
      };
    }
    if (files["avatar"]) {
      locateFileUpload = {
        ...locateFileUpload,
        avatar: `/uploads/${files["avatar"][0]["filename"]}`,
      };
    }
    req.locals = locateFileUpload;
    next();
  },
  updateFile
);
module.exports = router;
