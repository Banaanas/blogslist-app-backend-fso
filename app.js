import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors"; // Handle all the try/catch
import path from "path";

// Next() is not need anymore thanks to "express-async-errors" library;
// Handle all the try/catch
// Routers
import blogsRouter from "./controllers/blogs-router.js";
import usersRouter from "./controllers/users-router.js";
import loginRouter from "./controllers/login-router.js";
import testingRouter from "./controllers/testing-router.js";

// Utils
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import middlewares from "./utils/middlewares.js";

const app = express();

// Log Info
logger.logInfo("Connecting to", config.MONGODB_URI);

// Connection to DB - Function
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

// ** Middlewares ** //

// Get information about Requests
app.use(morgan("dev"));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

// TEST MODE - testingRouter - Special Router for Cypress Test
// If TEST MODE, then Import testing-router (to make Cypress "beforeach" DB operations)
// Conditional / Dynamic Import - https://2ality.com/2017/01/import-operator.html
// See also : https://stackoverflow.com/questions/35914712/es6-conditional-dynamic-import-statements
// "app.use(route, ()=> {import("...")}) (and Not "app.use(route, testingRouterValue)
// because Await Conditional / Dynamic Import returns a Promise (note a Primitive Value)

if (process.env.NODE_ENV === "test") {
  // testingRoute - Import - Function
  app.use("/api/testing", testingRouter);
  console.log("Testing Route Established");
}

// Extract token and put it as request property
app.use(middlewares.tokenExtractor);

// Routers
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// Catch All - Redirect All Requests to index.html - FRONT-END - PRODUCTION (build Folder)
// https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
const __dirname = path.resolve(
  path.dirname(decodeURI(new URL(import.meta.url).pathname)),
);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

export default app;
