import * as dotenv from "dotenv";
dotenv.config();

export default {
  main: {
    environment: process.env.NODE_ENV ?? "DEVELOPMENT", // PRODUCTION | DEVELOPMENT | STAGING
    port: process.env.PORT ?? "3000",
    corsUrl: process.env.CORS_URL ?? "*",
    feUrl: process.env.FE_URL ?? "http://localhost:4000",
    beUrl: process.env.BE_URL ?? "http://localhost:3000",
  },
  database: {
    dbURI: process.env.DB_URI ?? "",
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY ?? "dfadfasrdjsaf",
  },
  passport: {
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  },
};
