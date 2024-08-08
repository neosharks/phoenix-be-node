"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
//----------------------------------
const index_route_1 = __importDefault(require("./src/routes/index.route"));
//----------------------------------
const config_1 = __importDefault(require("./config"));
const logger_core_1 = __importDefault(require("./src/core/logger.core"));
const checkRoleAuth_middleware_1 = require("./src/middlewares/checkRoleAuth.middleware");
const Socket_1 = __importDefault(require("./src/utils/Socket"));
const path_1 = __importDefault(require("path"));
process.on("uncaughtException", (e) => {
    console.log("-----uncaughtException-----", e);
    process.exit(1);
});
var SocketIOFileUpload = require("socketio-file-upload");
const app = (0, express_1.default)()
    .use(express_1.default.static(__dirname + "/"))
    .use(SocketIOFileUpload.router);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 1e8,
});
// io.use(socketAuthMiddleware);
(0, Socket_1.default)(io);
// MIDDLEWARES
const corsUrl = config_1.default.main.corsUrl;
// Initialize socket connection
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use((0, cors_1.default)({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use((0, morgan_1.default)((tokens, req, res) => {
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
    logger_core_1.default.http(msg);
    return null;
}));
// Routes
app.get("/socket", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "html.html"));
});
app.use("/", index_route_1.default);
app.use((req, res, next) => res.status(404).json({ message: "Route not found" }));
exports.default = app;
