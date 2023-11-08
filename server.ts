import express from "express";
import cors from "cors";
import morgan from "morgan";
//----------------------------------
import routes from "./src/routes/index.route";
//----------------------------------
import config from "./config";
import Logger from "./src/core/logger.core";

process.on("uncaughtException", (e) => {
  Logger.error("-----uncaughtException-----", e);
  process.exit(1);
});

const app = express();

// MIDDLEWARES
const corsUrl = config.main.corsUrl;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

app.use(
  morgan((tokens, req, res) => {
    const msg = [
      tokens.status(req, res),
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
    Logger.http(msg);
    return null;
  }),
);

// Routes
app.use("/", routes);
app.use((req, res, next) => res.status(404).json({ message: "Route not found" }));

export default app;
