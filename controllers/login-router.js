import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "express-async-errors"; // Handle all the try/catch
import User from "../models/user.js";

// Next() is not need anymore thanks to "express-async-errors" library;
// Handle all the try/catch - cf. app.js

/** "express-async-errors" Library (imported in app.js) handles all the try/catch * */
const loginRouter = express.Router();

// LOGIN
loginRouter.post("/", async (req, res) => {
  const { body } = req;

  const user = await User.findOne({ username: body.username });

  const isPasswordCorrect = await bcrypt.compare( // Return a Promise
    body.password,
    user.passwordHash,
  );

  if (!(user && isPasswordCorrect)) {
    return res.status(401).json({
      error: "Invalid Username or Password",
    });
  }

  const userForToken = {
    username: user.username,
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET);
  res
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user._id });
});

export default loginRouter;
