const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../Models/User.model");

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createError.BadRequest();

    const userExists = await User.findOne({ email: email });

    if (userExists) throw createError.Conflict(`${email} already exists`);

    const user = new User({ email, password });
    const savedUser = await user.save();

    res.send(savedUser);
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  res.send("Login route");
});
router.post("/refresh-token", async (req, res, next) => {
  res.send("refresh-token route");
});
router.delete("/logout", async (req, res, next) => {
  res.send("logout route");
});

module.exports = router;
