import { checkForNullOrUndefinedKeys } from "./src/lib/helper.lib";
import logger from "./src/core/logger.core";
import config from "./config";
import app from "./server";
import chatSocket from "./src/utils/Socket";

const res = checkForNullOrUndefinedKeys(config);
if (res.length < 1) {
  const port = config.main.port;
  const server = app
    .listen(port, () => logger.info(`SERVER UP AT PORT ${port}`))
    .on("error", (e) => console.log("Error in starting server", e));

  // Initialize socket.io
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  chatSocket(io);
} else logger.info(`SERVER STOPPED DUE TO UNSET ENV VARS: ${res}`);

// temp commit
