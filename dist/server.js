"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
//----------------------------------
const index_route_1 = __importDefault(require("./src/routes/index.route"));
//----------------------------------
const config_1 = __importDefault(require("./config"));
const logger_core_1 = __importDefault(require("./src/core/logger.core"));
process.on("uncaughtException", (e) => {
    console.log("-----uncaughtException-----", e);
    process.exit(1);
});
const app = (0, express_1.default)();
// MIDDLEWARES
const corsUrl = config_1.default.main.corsUrl;
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use((0, cors_1.default)({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use((0, morgan_1.default)((tokens, req, res) => {
    const msg = [
        tokens.status(req, res),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
    ].join(" ");
    logger_core_1.default.http(msg);
    return null;
}));
// Routes
app.use("/", index_route_1.default);
app.use((req, res, next) => res.status(404).json({ message: "Route not found" }));
exports.default = app;
