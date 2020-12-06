import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../../app.js";
import helpersFile from "./helpers-functions";

// eslint-disable-next-line import/extensions
import Blog from "../../../models/blog.js";
import User from "../../../models/user";

// SuperTest Library
const api = supertest(app);

// Before each test, reinitialize test-Database
beforeEach(async () => {
  // Delete all Users previously created from test-Database
  await User.deleteMany({});

  // Delete all Blogs previously created from test-Database
  await Blog.deleteMany({});

  // Save initialBlogs into test-Database
  const blogObjectsArr = await helpersFile.initialBlogs.map(
    (blog) => new Blog(blog),
  );
  const promiseArray = blogObjectsArr.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("Supertest Library Function - Database Communication", () => {
  test("if Blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all Blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helpersFile.initialBlogs.length);
  });

  test("if a specific Blog is within the returned Blogs", async () => {
    const response = await api.get("/api/blogs");
    const titlesArr = response.body.map((res) => res.title);
    expect(titlesArr)
      .toContain("Some questions");
  });
});

describe("Supertest Library Function - Viewing Individual Blog", () => {
  it("should Succeed with valid id", async () => {
    const blogsAtStart = await helpersFile.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));
    expect(resultBlog.body).toEqual(processedBlogToView);
  });

  it("should Fail with status code 404 if valid ID but blog does NOT exist", async () => {
    const validNonexistingId = await helpersFile.nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  it("should Fail with status code 400 if ID is NOT valid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("Supertest Library Function - Unique Identifier is named 'id' (not '_id')", () => {
  it("'id' property must be defined", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });

  it("'_id' property must be UNdefined", async () => {
    const response = await api.get("/api/blogs");
    // eslint-disable-next-line no-underscore-dangle
    expect(response.body[0]._id).toBeUndefined();
  });
});

describe("Supertest Library Function - Addition of a new Blog", () => {
  let login;
  beforeEach(async () => {
    // Create User
    const newUser = {
      username: "Cyrilo",
      name: "Cyrilo Negro",
      password: "password",
      passwordConfirmation: "password",
    };

    // Save User to test-Database
    const jonas = await api.post("/api/users").send(newUser);
    // User Login (to set Access Token in Authorization Header after)
    login = await api.post("/api/login").send(newUser);
  });

  test("if a new blog can be added when Token is valid ", async () => {
    const newBlog = {
      title: "Les Fleurs du Mal",
      author: "Charles Baudelaire",
      url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal/1861/Texte_entier",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${login.body.token}`) // Set Authorization Header with Login Token
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helpersFile.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helpersFile.initialBlogs.length + 1);
  });

  test("if properties of the blog post are saved", async () => {
    const newBlog = {
      title: "Les Fleurs du Mal",
      author: "Charles Baudelaire",
      url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal/1861/Texte_entier",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${login.body.token}`)
      .send(newBlog);

    const blogsAtEnd = await helpersFile.blogsInDb();
    const lastBlogAdded = blogsAtEnd[blogsAtEnd.length - 1];
    expect(lastBlogAdded.title).toBe("Les Fleurs du Mal");
    expect(lastBlogAdded.author).toBe("Charles Baudelaire");
  });

  test("if blog addition FAILS with status code 401 if no Token is provided", async () => {
    const newBlog = {
      title: "Les Fleurs du Mal",
      author: "Charles Baudelaire",
      url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal/1861/Texte_entier",
      likes: 10,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("Supertest Library Function - Like Property", () => {
  let login;
  beforeEach(async () => {
    // Create User
    const newUser = {
      username: "Cyrilo",
      name: "Cyrilo Negro",
      password: "password",
      passwordConfirmation: "password",
    };

    // Save User to test-Database
    await api.post("/api/users").send(newUser);

    // User Login (to set Access Token in Authorization Header after)
    login = await api.post("/api/login").send(newUser);
  });

  test("if default value to likes is 0 if likes property is missing from request", async () => {
    const newBlog = {
      title: "Les Fleurs du Mal",
      author: "Charles Baudelaire",
      url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal/1861/Texte_entier",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${login.body.token}`)
      .send(newBlog);

    const blogsAtEnd = await helpersFile.blogsInDb();
    const lastBlogAdded = blogsAtEnd[blogsAtEnd.length - 1];
    expect(lastBlogAdded.likes).toBe(0);
  });
});

describe("Supertest Library Function - No Title / No Url", () => {
  test("if blog without title and/or url returns status code 404", async () => {
    const newBlog = {
      title: "Les Fleurs du Mal",
      author: "Charles Baudelaire",
      likes: 25,
    };

    const newBlog2 = {
      author: "Charles Baudelaire",
      url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal/1861/Texte_entier",
      likes: 25,
    };

    const newBlog3 = {
      author: "Charles Baudelaire",
      likes: 25,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
    await api.post("/api/blogs").send(newBlog2).expect(400);
    await api.post("/api/blogs").send(newBlog3).expect(400);
  });
});

describe("Supertest Library Function - Delete Blog", () => {
  let login;
  beforeEach(async () => {
    // Create User
    const newUser = {
      username: "Cyrilo",
      name: "Cyrilo Rojo",
      password: "password",
      passwordConfirmation: "password",
    };

    // Create newBlog
    const newBlog = {
      title: "Les Fleurs du Mal",
      author: "Charles Baudelaire",
      url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal/1861/Texte_entier",
    };

    // Save User to test-Database
    await api.post("/api/users").send(newUser);

    // User Login (to set Access Token in Authorization Header after)
    login = await api.post("/api/login").send(newUser);

    // Save newBlog to test-Database
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${login.body.token}`); // Set Authorization Header with Login Token
  });

  it("should SUCCEED with status code 204 if Token is valid", async () => {
    const blogsAtStart = await helpersFile.blogsInDb();
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

    // Single (new) User at start - Before Blog have been deleted
    const usersAtStart = await helpersFile.usersInDb(); // All Users at end
    const singleUserAtStart = await api
      .get(`/api/users/${usersAtStart[0].id}`)
      .set("Authorization", `bearer ${login.body.token}`); // Set Authorization Header with Login Token

    // Delete Blog
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${login.body.token}`) // Set Authorization Header with Login Token
      .expect(204);

    // Blog must have been deleted in Blogs collection
    const blogsAtEnd = await helpersFile.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    // Blog must have been ALSO deleted from single User Blogs array
    // Single (new) User at end - After Blog have been deleted
    const usersAtEnd = await helpersFile.usersInDb(); // All Users at end

    const singleUserAtEnd = await api
      .get(`/api/users/${usersAtEnd[0].id}`)
      .set("Authorization", `bearer ${login.body.token}`); // Set Authorization Header with Login Token

    expect(singleUserAtStart.body.blogs.length).not.toBe(
      singleUserAtEnd.body.blogs.length,
    );
    expect(singleUserAtStart.body.blogs.length).toBe(1);
    expect(singleUserAtEnd.body.blogs.length).toBe(0);
  });

  it("should FAIL with status code 401 if no Token is provided", async () => {
    const blogsAtStart = await helpersFile.blogsInDb();
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
  });
});

describe("Supertest Library Function - Update Blog", () => {
  let login;
  beforeEach(async () => {
    // Create User
    const newUser = {
      username: "Cyrilo",
      name: "Cyrilo Rojo",
      password: "password",
      passwordConfirmation: "password",
    };

    // Create newBlog
    const newBlog = {
      title: "Les Fleurs du Mal",
      author: "Charles Baudelaire",
      url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal/1861/Texte_entier",
    };

    // Save User to test-Database
    await api.post("/api/users").send(newUser);

    // User Login (to set Access Token in Authorization Header after)
    login = await api.post("/api/login").send(newUser);

    // Save newBlog to test-Database
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${login.body.token}`); // Set Authorization Header with Login Token
  });

  it("should SUCCEED with status code 204 if Token is valid", async () => {
    const blogsAtStart = await helpersFile.blogsInDb();
    const blogToUpdate = blogsAtStart[blogsAtStart.length - 1];

    const updatedBlog = {
      title: "UPDATED TITLE",
      author: "Charles Baudelaire",
      url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal/1861/Texte_entier",
      likes: 10,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .set("Authorization", `bearer ${login.body.token}`)
      .expect(200);

    const blogsAtEnd = await helpersFile.blogsInDb();
    const blogUpdated = blogsAtEnd[blogsAtEnd.length - 1];
    expect(blogUpdated.title).toContain("UPDATED TITLE");
    expect(blogUpdated.likes).toBe(10);
  });

  it("should FAIL with status code 404 if ID is INvalid", async () => {
    const blogsAtStart = await helpersFile.blogsInDb();
    const blogToUpdate = blogsAtStart[blogsAtStart.length - 1];

    const updatedBlog = {
      title: "UPDATED TITLE",
      author: "Charles Baudelaire",
      url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal/1861/Texte_entier",
      likes: 10,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
