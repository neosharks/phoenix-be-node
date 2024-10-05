import "newrelic";
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io"; // Import socket.io using ES6 syntax
import http from "http";
import path from "path";
import cluster from "cluster";
import os from "os";
import { connection } from "./sequelize";
import routes from "./src/routes/index.route";
import config from "./config";
import Logger from "./src/core/logger.core";
import chatSocket from "./src/utils/Socket";
import { checkForNullOrUndefinedKeys } from "./src/lib/helper.lib";

process.on("uncaughtException", (e) => {
  console.log("-----uncaughtException-----", e);
  process.exit(1);
});

// Check for missing environment variables
const res = checkForNullOrUndefinedKeys(config);

// Only proceed if all environment variables are set
if (res.length < 1) {
  const numCPUs = os.cpus().length; // Get the number of CPU cores

  // Master process: fork worker processes
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // Restart workers if they die
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    // Worker processes: run the Express server and socket
    const app = express()
      .use(express.static(__dirname + "/"))
      .use(require("socketio-file-upload").router);

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    chatSocket(io); // Initialize socket.io with chat functionality

    // Connect to the database
    connection();

    // MIDDLEWARES
    const corsUrl = config.main.corsUrl;

    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
    app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

    app.use(
      morgan((tokens, req, res) => {
        const user = res.locals.user;
        const userId = user ? user.id : "N/A";
        const ipAddress = req.ip;
        const msg = {
          status: tokens.status(req, res),
          method: tokens.method(req, res),
          url: tokens.url(req, res),
          responseTime: tokens["response-time"](req, res) + "ms",
          userId: userId,
        };
        Logger.http(msg);
        return null;
      }),
    );

    // Routes
    app.get("/socket", (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "public", "html.html"));
    });

    app.use("/", routes);
    app.use((req, res, next) => res.status(404).json({ message: "Route not found" }));

    const port = config.main.port || 3000;
    server.listen(port, () => {
      Logger.info(`Worker ${process.pid} started, SERVER UP AT PORT ${port}`);
    });

    server.on("error", (e) => {
      Logger.error("Error in starting server", e);
      process.exit(1);
    });
  }
} else {
  Logger.info(`SERVER STOPPED DUE TO UNSET ENV VARS: ${res}`);
  process.exit(1);
}
