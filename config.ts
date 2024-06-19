import * as dotenv from "dotenv";
dotenv.config();

export default {
  main: {
    environment: process.env.NODE_ENV ?? "", // PRODUCTION | DEVELOPMENT | STAGING
    port: process.env.PORT ?? "",
    corsUrl: process.env.CORS_URL ?? "",
    feUrl: process.env.FE_URL ?? "",
    beUrl: process.env.BE_URL ?? "",
  },
  database: {
    dbURI: process.env.DATABASE_URL ?? "",
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY ?? "",
  },
  aws: {
    region: process.env.AWS_REGION,
    accessId: process.env.AWS_ACCESS_KEY,
    accessSecret: process.env.AWS_ACCESS_SECRET,
    bucketName: process.env.AWS_BUCKET_NAME ?? "",
  },
  payment: {
    cashfree: {
      clientId: process.env.CASHFREE_CLIENT_ID ?? "",
      clientSecret: process.env.CASHFREE_CLIENT_SECRET ?? "",
      url: process.env.CASHFREE_URL || "",
      version: process.env.CASHFREE_VERSION || "2023-08-01",
      environment: process.env.CASHFREE_ENVIRONMENT || "",
    },
  },
  nodemailer: {
    email: process.env.NODEMAILER_EMAIL ?? "",
    password: process.env.NODEMAILER_PASS ?? "",
    host: process.env.NODEMAILER_HOST ?? "a",
    port: process.env.NODEMAILER_PORT ?? 0,
  },
  sms: {
    fast2sms: {
      key: process.env.FAST2SMS_KEY ?? "",
    },
  },
};
