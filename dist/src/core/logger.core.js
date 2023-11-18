"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console({
            level: "debug",
            handleExceptions: true,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "HH:mm:ss:ms" }), winston_1.default.format.colorize(), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
        }),
    ],
    exitOnError: false,
});
winston_1.default.addColors({
    error: "red",
    warn: "yellow",
    info: "cyan",
    debug: "green",
    http: "blue",
});
logger.add(new winston_1.default.transports.File({
    level: "info",
    filename: "./logs/all-logs.json",
    handleExceptions: true,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`), winston_1.default.format.splat(), winston_1.default.format.json()),
    maxsize: 5242880,
    maxFiles: 5,
}));
exports.default = logger;
