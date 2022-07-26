const { userInfo } = require("../src/api");
const express = require("express");
const router = express.Router();

router.get("/user", userInfo);
module.exports = router;
