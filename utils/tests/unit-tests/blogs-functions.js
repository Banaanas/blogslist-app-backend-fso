const dummy = () => 1;

const totalLikes = (blogsList) => {
  if (blogsList.length === 0) return 0;
  return blogsList.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogsList) => {
  if (blogsList.length === 0) return 0;

  return blogsList.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current,
  );
};

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
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
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

// Author(s) with highest blogs number
const highestAuthorsOccurrences = (arr) => {
  // If no Blog, return 0
  if (arr.length === 0) return 0;

  // Set array of authors'name occurrences
  const authorsOccurrencesArray = arr.map((blog) => blog.author);

  // Sort elements by occurrences, from the highest to the lowest
  authorsOccurrencesArray.sort(
    (a, b) =>
      authorsOccurrencesArray.filter((author) => author === b).length -
      authorsOccurrencesArray.filter((author) => author === a).length,
  );

  // Set Results array
  const results = [];

  authorsOccurrencesArray.forEach((item) => {
    // Analyze if Author Object has already been pushed to Results Array
    const alreadyPushedAuthor = results.filter((obj) => obj.author === item);

    // Author has not been pushed to Results array
    // Push Author's object
    if (alreadyPushedAuthor.length === 0) {
      const obj = {
        author: item,
        blogs: 1,
      };
      return results.push(obj);
    }

    // Author has ALREADY been pushed to Results array
    // Update blogs number
    if (alreadyPushedAuthor.length > 0) {
      const indexArr = results.findIndex((x) => x.author === item);
      results[indexArr].blogs = results[indexArr].blogs + 1;
    }
  });

  // Define the highest blogs number value
  const highestBlogsNumber = results[0].blogs;

  // Return Array with authors whose blogs number is the highest
  return results.filter((blog) => blog.blogs === highestBlogsNumber);
};

// Author(s) with highest likes number
const mostLikedAuthors = (arr) => {
  // If no Blog, return 0
  if (arr.length === 0) return 0;

  // Set array of authors name occurrences
  const authorsOccurrencesArray = arr.map((blog) => blog.author);

  // Remove duplicates elements from authors array
  const unique = [...new Set(authorsOccurrencesArray)];

  const results = [];
  unique.forEach((item) => {
    const obj = {
      author: item,
      likes: 0,
    };
    results.push(obj);
  });

  results.forEach((item) => {
    arr.forEach((blog) => {
      if (blog.author === item.author) {
        item.likes += blog.likes;
      }
    });
  });

  // Sort results by descending likes number
  results.sort((a, b) => b.likes - a.likes);

  // Define the highest blogs number value
  const highestBlogsNumber = results[0].likes;

  // Return Array with authors whose blogs number is the highest
  return results.filter((blog) => blog.likes === highestBlogsNumber);
};

export default {
  dummy,
  totalLikes,
  favoriteBlog,
  highestAuthorsOccurrences,
  mostLikedAuthors,
};
