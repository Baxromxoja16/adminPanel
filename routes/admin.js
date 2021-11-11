const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Admin = require("../models/Admin");

/* GET users listing. */
router.get("/", auth, async (req, res) => {
  const admin = req.session.admin;
  console.log(admin);
  res.render("admin/index", {
    title: "Admin panel",
    layout: "main",
    admin,
  });
});

module.exports = router;
