const { userInfo, contact, login, dashboard } = require("../src/api");
const express = require("express");
const router = express.Router();

router.get("/user", userInfo);
router.get("/dashboard", dashboard);
router.route("/contact").post(contact);
router.route("/admin/login").post(login);
module.exports = router;
