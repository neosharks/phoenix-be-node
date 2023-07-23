import Logger from "./src/core/Logger";
import config from "./config";
import app from "./server";

const port = config.main.port;

app
  .listen(port, () => {
    Logger.info(`SERVER RUNNING ON PORT : ${port} 🚀`);
  })
  .on("error", (e) => Logger.error("Error in starting server", e));
