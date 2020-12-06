import Blog from "../../../models/blog.js";
import User from "../../../models/user.js";

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Life of John Doe",
    author: "John Doe",
    url: "https://johndoe.com",
  });

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const firstUser = async () => {
  const users = await usersInDb();
  const firstUserId = users[0].id.toString();
  const user = await User.findById(firstUserId);

  const userIdObj = user._id;
  return userIdObj;
};

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Array variables",
    author: "Edsger W. Dijkstra",
    url:
      "https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD428.html",
    likes: 5,
  },
  {
    title: "Some questions",
    author: "Edsger W. Dijkstra",
    url: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD463.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
  },
  {
    title: "Solid Relevance",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

export default {
  nonExistingId,
  blogsInDb,
  usersInDb,
  firstUser,
  initialBlogs,
};
