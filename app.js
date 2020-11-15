import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors"; // Handle all the try/catch

// Next() is not need anymore thanks to "express-async-errors" library;
// Handle all the try/catch - cf. app.js

// Routers
import contactsRouter from "./controllers/blogs-router.js";
import usersRouter from "./controllers/users-router.js";
import loginRouter from "./controllers/login-router.js";
import testingRouter from "./controllers/testing-router.js";

import config from "./utils/config.js";
import logger from "./utils/logger.js";
import middlewares from "./utils/middlewares.js";

const app = express();

// Log Info
logger.logInfo("Connecting to ", config.MONGODB_URI);

// Connection to DB
const connectToDB = async () => {
  const url = config.MONGODB_URI;

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("Error connecting to MongoDB:", e.message);
  }
};
connectToDB();

// // Middlewares

// Get information about Requests
app.use(morgan("tiny"));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

// If Testing Process - testingRouter
if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

// Extract token and put it as request property
app.use(middlewares.tokenExtractor);

// Routers
app.use("/api/blogs", contactsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

export default app;
