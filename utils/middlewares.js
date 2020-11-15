import logger from "./logger.js";

// Log information
const requestLogger = (req, res, next) => {
  logger.logInfo("Method", req.method);
  logger.logInfo("Path", req.method);
  logger.logInfo("Body", req.body);
  logger.logInfo("---");
  next();
};

// Handler of requests with unknown endpoint

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown Endpoint" });
};

// Handler of requests with result to errors

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Invalid ID" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "Invalid Token" });
  }

  logger.logError(error.message);
  next(error);
};

// Extract token from the Authorization header

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");

  // Create Token property into Request Object
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    request.token = authorization.substring(7);
  } else {
    // If there is no proper Authorization Header, then token = null
    request.token = null;
  }
  next();
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
