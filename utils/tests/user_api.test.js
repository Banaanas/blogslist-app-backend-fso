import mongoose from "mongoose";
import supertest from "supertest";
import bcrypt from "bcrypt";
import app from "../../app.js";
import helpersFile from "./helpers-functions.js";
import User from "../../models/user.js";
import Blog from "../../models/blog";

const api = supertest(app);

// Before all tests
beforeEach(async () => {
  // Delete all Users previously created from test-Database
  await User.deleteMany({});

  // Delete all Blogs previously created from test-Database
  await Blog.deleteMany({});

  // Create User in test-Database
  const passwordHash = await bcrypt.hash("secret", 10);
  const user = new User({
    username: "Cyrilo",
    name: "Cyrilo Rojo",
    passwordHash,
  });

  // Save User to test-Database
  await user.save();
});

describe("Supertest Library Function - Single User Request", () => {
  test("if get Single User with ALL Blogs array inside", async () => {
    const newUser = {
      username: "Schtroumpf",
      name: "Schtroumpf Grognon",
      password: "password",
      passwordConfirmation: "password",
    };

    // Save new User into testing-Database
    await api.post("/api/users").send(newUser);

    // User Login (to set Access Token in Authorization Header after)
    const login = await api.post("/api/login").send(newUser);

    // All Users at start
    const usersAtStart = await helpersFile.usersInDb();

    // Single (new) User at start
    const singleUserAtStart = await api
      .get(`/api/users/${usersAtStart[1].id}`)
      .set("Authorization", `bearer ${login.body.token}`); // Set Authorization Header with Login Token

    // Save all Blogs into single User
    // Parallel Method (map() and Promise.all) would not work because
    // of some Mongo Id problem
    // That's why we use Sequential Method (for...of)
    const newUserBlogsArr = helpersFile.initialBlogs;

    // eslint-disable-next-line no-restricted-syntax
    for (const blog of newUserBlogsArr) {
      // eslint-disable-next-line no-await-in-loop
      await api
        .post("/api/blogs")
        .send(blog)
        .set("Authorization", `bearer ${login.body.token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    }

    // All Users at end
    const usersAtEnd = await helpersFile.usersInDb();

    // Single (new) User at end - After Blogs have been saved
    const singleUserAtEnd = await api
      .get(`/api/users/${usersAtEnd[1].id}`)
      .set("Authorization", `bearer ${login.body.token}`); // Set Authorization Header with Login Token

    // Expect the Single User at Start to contain no Blog
    // BEFORE Blogs have been saved
    expect(singleUserAtStart.body.blogs.length).toEqual(0);

    // Expect the Single User at End request to contain all the Blogs inside
    // its Blogs array AFTER blogs have been saved
    expect(singleUserAtEnd.body.blogs.length).toEqual(
      helpersFile.initialBlogs.length,
    );
  });
});

describe("Supertest Library Function - User creation", () => {
  test("if creation SUCCEEDS with a fresh/brand new/unique username", async () => {
    const usersAtStart = await helpersFile.usersInDb();

    const newUser = {
      username: "Schtroumpf",
      name: "Schtroumpf Gourmand",
      password: "password",
      passwordConfirmation: "password",
    };

    await api.post("/api/users").send(newUser);
    const usersAtEnd = await helpersFile.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usersNamesArr = usersAtEnd.map((u) => u.username);
    expect(usersNamesArr).toContain(newUser.username);
  });

  test("if creation FAILS with proper status code and message if username is already taken", async () => {
    const usersAtStart = await helpersFile.usersInDb();

    const newUser = {
      username: "Cyrilo", // Same username as first user
      name: "Cyrilo Amarillo",
      password: "password",
      passwordConfirmation: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helpersFile.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("if creation FAILS with proper status code if password is shorter than 5 characters", async () => {
    const usersAtStart = await helpersFile.usersInDb();

    const newUser = {
      username: "Mango", // Same username as first user
      name: "Cyril",
      password: "pass",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Password is too short");

    const usersAtEnd = await helpersFile.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
