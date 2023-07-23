import * as dotenv from "dotenv";
dotenv.config();

export default {
  main: {
    environment: process.env.NODE_ENV ?? "DEV",
    port: process.env.PORT ?? "3000",
    corsUrl: process.env.CORS_URL ?? "*",
  },
  database: {
    dbURI: process.env.DB_URI ?? "",
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY ?? "dfadfasrdjsaf",
  },
};
