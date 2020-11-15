import helpers from "./blogs-functions";

const listWithNoBlog = [];

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const listWithMultipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

describe("Dummy Function", () => {
  it("should return 1", () => {
    expect(helpers.dummy(listWithNoBlog)).toBe(1);
  });
});

describe("totalLikes Function", () => {
  test("if of 0 blog, it returns 0", () => {
    expect(helpers.totalLikes(listWithNoBlog)).toBe(0);
  });

  test("if of 1 blog, it returns the total likes of the blog", () => {
    expect(helpers.totalLikes(listWithOneBlog)).toBe(5);
  });

  test("if of multiple blogs, it returns the total likes of all the blogs", () => {
    expect(helpers.totalLikes(listWithMultipleBlogs)).toBe(36);
  });
});

describe("favoriteBlog Function", () => {
  test("if of 0 blog, it returns 0", () => {
    expect(helpers.favoriteBlog(listWithNoBlog)).toBe(0);
  });

  test("if of 1 blog, it returns the blog", () => {
    expect(helpers.favoriteBlog(listWithOneBlog)).toMatchObject(
      listWithOneBlog[0],
    );
  });

  test("if of multiple blogs, it returns the most liked blog", () => {
    expect(helpers.favoriteBlog(listWithMultipleBlogs)).toMatchObject(
      listWithMultipleBlogs[2],
    );
  });
});

describe("highestAuthorsOccurrences Function", () => {
  test("if of 0 blog, it returns 0", () => {
    expect(helpers.highestAuthorsOccurrences(listWithNoBlog)).toBe(0);
  });

  test("if of 1 blog, it returns the blog", () => {
    expect(helpers.highestAuthorsOccurrences(listWithOneBlog)).toMatchObject([
      { author: "Edsger W. Dijkstra", blogs: 1 },
    ]);
  });

  test("if of multiple blogs, it returns the most liked blog", () => {
    expect(
      helpers.highestAuthorsOccurrences(listWithMultipleBlogs),
    ).toMatchObject([{ author: "Robert C. Martin", blogs: 3 }]);
  });
});

describe("mostLikedAuthors Function", () => {
  test("if of 0 blog, it returns 0", () => {
    expect(helpers.mostLikedAuthors(listWithNoBlog)).toBe(0);
  });

  test("if of 1 blog, it returns the blog", () => {
    expect(helpers.mostLikedAuthors(listWithOneBlog)).toMatchObject([
      { author: "Edsger W. Dijkstra", likes: 5 },
    ]);
  });

  test("if of multiple blogs, it returns the most liked blog", () => {
    expect(
      helpers.mostLikedAuthors(listWithMultipleBlogs),
    ).toMatchObject([{ author: "Edsger W. Dijkstra", likes: 17 }]);
  });
});
