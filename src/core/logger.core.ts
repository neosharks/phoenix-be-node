import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: "HH:mm:ss:ms" }),
        winston.format.printf((info) => JSON.stringify(info)),
      ),
    }),
    new winston.transports.File({
      level: "debug",
      filename: "./logs/all-logs.json",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

export default logger;
