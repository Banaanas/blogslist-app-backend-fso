import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// To clear Deprecated Warning on console
mongoose.set("useCreateIndex", true);

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  author: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  url: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 80,
  },
  likes: { type: Number },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Overwrites default Schema Object
// When objects are returned -->
// Transform mongoDB "_id" (which is not a string) to string
// Transform mongoDB "_id" to "id"
// Delete "_id"
// Delete "__v"
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-underscore-dangle
    returnedObject.id = returnedObject._id.toString();
    // eslint-disable-next-line no-underscore-dangle
    delete returnedObject._id;
    // eslint-disable-next-line no-underscore-dangle
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
