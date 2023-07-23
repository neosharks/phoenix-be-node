import express from "express";
import cors from "cors";
import morgan from "morgan";
//----------------------------------
import authRoutes from "./src/routes/auth.route";
//----------------------------------
import config from "./config";
import Logger from "./src/core/Logger";
import chatRoutes from "./src/routes/chat.route";
import packageRoutes from "./src/routes/package.routes";

process.on("uncaughtException", (e) => {
  Logger.error("-----uncaughtException-----", e);
});

const app = express();
// MIDDLEWARES

const corsUrl = config.main.corsUrl;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: corsUrl,
  }),
);

app.use(
  morgan(function (tokens, req, res) {
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
app.get("/", (_, res) => res.send("<h1>Healthy server!</h1>"));
app.get("/fail", (_, res) => res.send("<h1>Fail</h1>"));
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/package", packageRoutes);

export default app;
