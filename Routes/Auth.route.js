const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema } = require("../utils/schema_validation");
const { signAccessToken, signedRefreshToken } = require("../utils/jwt_helper");

router.post("/register", async (req, res, next) => {
  try {
    const validatedUser = await authSchema.validateAsync(req.body);

    const userExists = await User.findOne({ email: validatedUser.email });

    if (userExists)
      throw createError.Conflict(`${validatedUser.email} already exists`);

    const user = new User(validatedUser);
    const savedUser = await user.save();

    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signedRefreshToken(savedUser.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const validatedUser = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: validatedUser.email });

    if (!user) throw createError.NotFound("User not registered");

    const foundUser = await user.isValidPassword(validatedUser.password);
    if (!foundUser) throw createError.Unauthorized("Username/Password invalid");

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signedRefreshToken(user.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest("Invalid username or password"));
    next(error);
  }
});
router.post("/refresh-token", async (req, res, next) => {
  res.send("refresh-token route");
});
router.delete("/logout", async (req, res, next) => {
  res.send("logout route");
});

module.exports = router;
