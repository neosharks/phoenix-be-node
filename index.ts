import Logger from "./src/core/logger.core";
import config from "./config";
import app from "./server";

const port = config.main.port;

app.listen(port).on("error", (e) => Logger.error("Error in starting server", e));
