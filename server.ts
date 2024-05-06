import express, { Request, Response, response } from "express";
import cors from "cors";
import morgan from "morgan";
//----------------------------------
import routes from "./src/routes/index.route";
//----------------------------------
import config from "./config";
import Logger from "./src/core/logger.core";
import { CommonService } from "./src/services/common.service";

process.on("uncaughtException", (e) => {
  console.log("-----uncaughtException-----", e);
  process.exit(1);
});

const app = express();

// MIDDLEWARES
const corsUrl = config.main.corsUrl;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// app.use(async (req, res: any, next) => {
//   const method = req.method;
//   const url = req.originalUrl;
//   const response = res.statusCode;

//   const originalSend = res.send;
//   res.send = async function (data: any) {
//     const result = originalSend.call(this, data);
//     if (res.statusCode && url !== "/user/get") {
//       await CommonService.createClickStream({
//         userId: res?.locals?.user ? res.locals.user.id : null,
//         url: url,
//         info: { body: req.body || {} },
//         ipAddress: req.ip,
//         method: method,
//         response,
//       });
//     }
//     return result;
//   };

//   next();
// });

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
app.use("/", routes);
app.use((req, res, next) => res.status(404).json({ message: "Route not found" }));

export default app;
