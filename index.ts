import { checkForNullOrUndefinedKeys } from "./src/lib/helper.lib";
import logger from "./src/core/logger.core";
import config from "./config";
import app from "./server";

const res = checkForNullOrUndefinedKeys(config);
if (res.length < 1) {
  const port = config.main.port;
  app
    .listen(port, () => logger.info(`SERVER UP AT PORT ${port}`))
    .on("error", (e) => console.log("Error in starting server", e));
} else logger.info(`SERVER STOPPED DUE TO UNSET ENV VARS: ${res}`);
