"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("newrelic");
const helper_lib_1 = require("./src/lib/helper.lib");
const logger_core_1 = __importDefault(require("./src/core/logger.core"));
const config_1 = __importDefault(require("./config"));
const server_1 = __importDefault(require("./server"));
const Socket_1 = __importDefault(require("./src/utils/Socket"));
const res = (0, helper_lib_1.checkForNullOrUndefinedKeys)(config_1.default);
if (res.length < 1) {
    const port = config_1.default.main.port;
    const server = server_1.default
        .listen(port, () => logger_core_1.default.info(`SERVER UP AT PORT ${port}`))
        .on("error", (e) => console.log("Error in starting server", e));
    // Initialize socket.io
    const { Server } = require("socket.io");
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });
    (0, Socket_1.default)(io);
}
else
    logger_core_1.default.info(`SERVER STOPPED DUE TO UNSET ENV VARS: ${res}`);
// temp commit
