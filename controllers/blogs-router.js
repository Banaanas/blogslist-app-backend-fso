import express from "express";
import jwt from "jsonwebtoken";
import "express-async-errors"; // Handle all the try/catch
import Blog from "../models/blog.js";
import User from "../models/user.js";

// Next() is not need anymore thanks to "express-async-errors" library;
// Handle all the try/catch - cf. app.js

const blogsRouter = express.Router();

// HOMEPAGE - ALL BLOGS (FROM ALL USERS)
// (For example purpose, authentication has not been set for this route)
blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

// SINGLE BLOG - (For example purpose, authentication has not been set for this route)
blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  // If Blog Not found
  if (!blog) return res.status(404).end();

  res.json(blog);
});

// ADD NEW BLOG
blogsRouter.post("/", async (req, res, next) => {
  const { body } = req;

  // If neither likes nor url, then return status code 400
  if (!body.title || !body.url) return res.status(400).end();

  // If no likes, then likes === 0
  if (!body.likes) {
    body.likes = 0;
  }

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
  const user = await User.findById(decryptedToken.id);

  // newBlog Object
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    // eslint-disable-next-line no-underscore-dangle
    user: user._id, // Store User id
  });

  // Save newBlog to DB
  const savedBlog = await newBlog.save();

  // Add newBlog (id) into user's blogs (id) array
  // eslint-disable-next-line no-underscore-dangle
  user.blogs = [...user.blogs, savedBlog._id];
  console.log(user.blogs);
  await user.save();

  res.json(savedBlog);
});

// DELETE BLOG
blogsRouter.delete("/:id", async (req, res) => {
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

  // Get User ID from Blog-to-delete-ID
  const blog = await Blog.findById(req.params.id);
  const blogUserId = blog.user;

  // If decryptedToken.id DOES NOT correspond to blogUserId, RETURN 403
  if (decryptedToken.id.toString() !== blogUserId.toString()) {
    return res.status(403).json({ error: "Invalid Token" });
  }

  //* * * If decryptedToken.id DOES correspond to blogUserId * * *//

  //* * DELETE BLOG * *//

  // Delete Blog
  await Blog.findByIdAndDelete(req.params.id);

  //* * REMOVE BLOG ID FROM USER COLLECTION * *//

  const updatedUser = await User.findById(blogUserId);
  const updatedUserBlogsArr = updatedUser.blogs.filter(
    // Return User's Blogs IDs without the ID of the deleted Blog
    (blogID) => blogID.toString() !== req.params.id,
  );

  updatedUser.blogs = updatedUserBlogsArr; // Replace User's Blog ID array
  await updatedUser.save(); // Save updated User

  res.status(204).end();
});

// UPDATE BLOG
blogsRouter.put("/:id", async (req, res) => {
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

  // Get User ID from Blog-to-Update-ID
  const blog = await Blog.findById(req.params.id);
  const blogUserId = blog.user;

  // If decryptedToken.id DOES NOT correspond to blogUserId, RETURN 403
  if (decryptedToken.id.toString() !== blogUserId.toString()) {
    return res.status(403).json({ error: "Invalid Token" });
  }

  // Create new Blog (updated Blog)
  const { body } = req;
  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  // If decryptedToken.id DOES correspond to blogUserId, UPDATE Blog-to-update
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, {
    new: true,
  });
  res.json(updatedBlog);
});

// LIKE BLOG
// Unlike general Update, Blog Like is authorized without Authentication
blogsRouter.put("/like/:id", async (req, res) => {
  // Create new Blog (updated Blog)
  const { body } = req;
  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  // If decryptedToken.id DOES correspond to blogUserId, UPDATE Blog-to-update
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, {
    new: true,
  });

  // If No Blog Found, RETURN 403
  if (updatedBlog === null) {
    return res.status(403).json({ error: "Blog Not Found" });
  }

  // If decryptedToken.id DOES correspond to blogUserId, UPDATE Blog-to-update
  res.json(updatedBlog);
});

export default blogsRouter;
