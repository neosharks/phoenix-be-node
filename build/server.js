"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
//----------------------------------
const index_route_1 = __importDefault(require("./src/routes/index.route"));
//----------------------------------
const config_1 = __importDefault(require("./config"));
const logger_core_1 = __importDefault(require("./src/core/logger.core"));
const Socket_1 = __importDefault(require("./src/utils/Socket"));
const logger_core_2 = __importDefault(require("./src/core/logger.core"));
const email_core_1 = __importDefault(require("./src/core/email.core"));
const api_constant_1 = require("./src/constant/api.constant");
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
});
(0, Socket_1.default)(io);
const corsUrl = config_1.default.main.corsUrl;
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use((0, cors_1.default)({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use((0, morgan_1.default)((tokens, req, res) => {
    const user = res.locals.user;
    const userId = user ? user.id : "N/A";
    const msg = {
        status: tokens.status(req, res),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        responseTime: tokens["response-time"](req, res) + "ms",
        userId: userId,
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
app.use((err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_core_2.default.error(err.message, { stack: err.stack });
    try {
        if (config_1.default.main.environment === "PRODUCTION") {
            yield (0, email_core_1.default)("thakursatyam9415@gmail.com", "500 SERVER ERROR", "SERVER_ERROR");
            yield (0, email_core_1.default)("vaibhavshukla182@gmail.com", "500 SERVER ERROR", "SERVER_ERROR");
        }
    }
    catch (emailError) {
        logger_core_2.default.error("Failed to send error email notification:", { stack: emailError.stack });
    }
    res.status(api_constant_1.errorCode.INTERNAL_SERVER).send({ message: api_constant_1.errorCode.INTERNAL_SERVER });
}));
exports.default = app;
