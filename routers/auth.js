const { createUser, updateUser } = require("../src/api");
const express = require("express");
const router = express.Router();

router.route("/user").post(createUser).patch(updateUser);
module.exports = router;
