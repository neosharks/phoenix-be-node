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
    razorpay: {
      clientId: process.env.RAZORPAY_CLIENT_ID || "",
      clientSecret: process.env.RAZORPAY_CLIENT_SECRET || "",
    },
  },
};
