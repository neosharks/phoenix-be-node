"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_lib_1 = require("./src/lib/helper.lib");
const logger_core_1 = __importDefault(require("./src/core/logger.core"));
const config_1 = __importDefault(require("./config"));
const server_1 = __importDefault(require("./server"));
const res = (0, helper_lib_1.checkForNullOrUndefinedKeys)(config_1.default);
if (res.length < 1) {
    const port = config_1.default.main.port;
    server_1.default
        .listen(port, () => logger_core_1.default.info(`SERVER UP AT PORT ${port}`))
        .on("error", (e) => console.log("Error in starting server", e));
}
else
    logger_core_1.default.info(`SERVER STOPPED DUE TO UNSET ENV VARS: ${res}`);
