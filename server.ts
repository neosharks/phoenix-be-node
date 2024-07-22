import express, { Request, Response, response } from "express";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
//----------------------------------
import routes from "./src/routes/index.route";
//----------------------------------
import config from "./config";
import Logger from "./src/core/logger.core";
import { CommonService } from "./src/services/common.service";
import chatSocket from "./src/utils/Socket";
import initializeSocket from "./src/utils/Socket";
import path from "path";

process.on("uncaughtException", (e) => {
  console.log("-----uncaughtException-----", e);
  process.exit(1);
});

const app = express();

const server = http.createServer(app);
// const io = new Server(server);
// chatSocket(io);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
chatSocket(io);

// MIDDLEWARES
const corsUrl = config.main.corsUrl;

// Initialize socket connection
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
      contentLength: tokens.res(req, res, "content-length"),
      responseTime: tokens["response-time"](req, res) + "ms",
      userId: userId, // Separate key for user ID
      ipAddress: ipAddress, // Separate key for IP address
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

export default app;
