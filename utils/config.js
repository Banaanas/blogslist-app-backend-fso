import dotenv from "dotenv";

// Loads environment variables from .env file
dotenv.config();

// Set PORT
const { PORT } = process.env;

// SET DATABASE
let { MONGODB_URI } = process.env;

// PRODUCTION MODE - PRODUCTION DATABASE - Special Database for Production
if (process.env.NODE_ENV === "production") {
  MONGODB_URI = process.env.PRODUCTION_MONGODB_URI;
  console.log("Production Mode");
}

// DEVELOPMENT MODE - DEVELOPMENT DATABASE - Special Database for Development
if (process.env.NODE_ENV === "development") {
  MONGODB_URI = process.env.DEVELOPMENT_MONGODB_URI;
  console.log("Development Mode");
}

// TEST MODE - TESTING DATABASE - Special Database for Testing
if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TESTING_MONGODB_URI;
  console.log("Testing Mode");
}

export default {
  PORT,
  MONGODB_URI,
};
