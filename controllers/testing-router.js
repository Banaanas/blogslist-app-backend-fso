import express from "express";
import Blog from "../models/blog.js";
import User from "../models/user.js";

/** "express-async-errors" Library (imported in app.js) handles all the try/catch * */
const testingRouter = express.Router();

// FRONT-END - CYPRESS PURPOSE
// This Route is used to Delete all Testing Database collections before running Cypress Tests
// This Route is only accessible on Test Mode (cf. app.js)
testingRouter.post("/reset", async (request, response) => {
  // Empty Database
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(204)
    .end();
});

export default testingRouter;
