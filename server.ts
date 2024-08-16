import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
//----------------------------------
import routes from "./src/routes/index.route";
import { connection } from "./sequelize";
//----------------------------------
import config from "./config";
import Logger from "./src/core/logger.core";
import { CommonService } from "./src/services/common.service";
import { socketAuthMiddleware } from "./src/middlewares/checkRoleAuth.middleware";
import chatSocket from "./src/utils/Socket";
import path from "path";

process.on("uncaughtException", (e) => {
  console.log("-----uncaughtException-----", e);
  process.exit(1);
});
connection();

var SocketIOFileUpload = require("socketio-file-upload");
const app = express()
  .use(express.static(__dirname + "/"))
  .use(SocketIOFileUpload.router);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8,
});

// io.use(socketAuthMiddleware);
chatSocket(io);

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
      userId: userId, // Separate key for user ID
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
