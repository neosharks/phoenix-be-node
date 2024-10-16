import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
import path from "path";
//----------------------------------
import routes from "./src/routes/index.route";
//----------------------------------
import config from "./config";
import Logger from "./src/core/logger.core";
import chatSocket from "./src/utils/Socket";
import logger from "./src/core/logger.core";
import sendEmail from "./src/core/email.core";
import { errorCode } from "./src/constant/api.constant";

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
});

chatSocket(io);

const corsUrl = config.main.corsUrl;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

app.use(
  morgan((tokens, req, res: any) => {
    const user = res.locals.user;
    const userId = user ? user.id : "N/A";
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

app.use(async (err: any, req: Request, res: Response, next: any) => {
  logger.error(err.message, { stack: err.stack });
  try {
    if (config.main.environment === "PRODUCTION") {
      await sendEmail("thakursatyam9415@gmail.com", "500 SERVER ERROR", "SERVER_ERROR");
      await sendEmail("vaibhavshukla182@gmail.com", "500 SERVER ERROR", "SERVER_ERROR");
    }
  } catch (emailError: any) {
    logger.error("Failed to send error email notification:", { stack: emailError.stack });
  }
  res.status(errorCode.INTERNAL_SERVER).send({ message: errorCode.INTERNAL_SERVER });
});

export default app;
