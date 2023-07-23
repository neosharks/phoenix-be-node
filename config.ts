import * as dotenv from "dotenv";
dotenv.config();

export default {
  main: {
    environment: process.env.NODE_ENV ?? "",
    port: process.env.PORT ?? "",
    corsUrl: process.env.CORS_URL ?? "*",
  },
  database: {
    dbURI: process.env.DB_URI ?? "",
  },
};
