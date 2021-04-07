import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "express-async-errors"; // Handle all the try/catch
import User from "../models/user.js";

// Next() is not need anymore thanks to "express-async-errors" library;
// Handle all the try/catch - cf. app.js

/** "express-async-errors" Library (imported in app.js) handles all the try/catch * */
const usersRouter = express.Router();

// ALL USERS - (For example purpose, authentication has not been set for this route)
usersRouter.get("/", async (req, res) => {
  // populate() method defines that the ids referencing Blog objects in the Blogs field of
  // the User document will be replaced by the referenced Blog documents
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  res.json(users);
});

// SINGLE USER
usersRouter.get("/:userID", async (req, res, next) => {
  const { token } = req;

  // If No Token (=== null), RETURN 401
  if (!token) {
    return res.status(401).json({ error: "Missing Token" });
  }

  const decryptedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // If Decrypted Token without ID, RETURN 403
  if (!decryptedToken.id) {
    return res.status(403).json({ error: "Invalid Token" });
  }

  // Find User
  // populate() method defines that the ids referencing Blog objects in the Blogs field of
  // the User document will be replaced by the referenced Blog documents
  const user = await User.findById(req.params.userID).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  if (!user) return res.status(404).end();

  res.json(user);
});

// CREATE USER
usersRouter.post("/", async (req, res) => {
  const { body } = req;

  // Because password.length !== passwordHash.length, password.length should be validated
  // in the Controller (and not the Model)
  if (body.password.length < 5) {
    return res.status(401).json({
      error: "Password is too short",
    });
  }

  // Because password.length !== passwordHash.length, password.length should be validated
  // in the controller
  if (body.password.length > 15) {
    return res.status(401).json({
      error: "Password is too long",
    });
  }

  const { passwordConfirmation } = body;

  // If password and passwordConfirm don't match, RETURN 401
  if (body.password.localeCompare(passwordConfirmation) !== 0) {
    return res.status(401).json({
      error: "password and passwordConfirmation don't match",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.json(savedUser);
});

export default usersRouter;
