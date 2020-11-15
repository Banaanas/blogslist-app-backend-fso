import http from "http";
import app from "./app.js";
import config from "./utils/config.js";
import logger from "./utils/logger.js";

const server = http.createServer(app);

server.listen(config.PORT);
logger.logInfo(`Server running on Port ${config.PORT}`);