"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.default = {
    main: {
        environment: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "", // PRODUCTION | DEVELOPMENT | STAGING
        port: (_b = process.env.PORT) !== null && _b !== void 0 ? _b : "",
        corsUrl: (_c = process.env.CORS_URL) !== null && _c !== void 0 ? _c : "",
        feUrl: (_d = process.env.FE_URL) !== null && _d !== void 0 ? _d : "",
        beUrl: (_e = process.env.BE_URL) !== null && _e !== void 0 ? _e : "",
    },
    database: {
        dbURI: (_f = process.env.DATABASE_URL) !== null && _f !== void 0 ? _f : "",
    },
    jwt: {
        accessTokenKey: (_g = process.env.ACCESS_TOKEN_KEY) !== null && _g !== void 0 ? _g : "",
    },
    aws: {
        region: process.env.AWS_REGION,
        accessId: process.env.AWS_ACCESS_KEY,
        accessSecret: process.env.AWS_ACCESS_SECRET,
        bucketName: (_h = process.env.AWS_BUCKET_NAME) !== null && _h !== void 0 ? _h : "",
    },
    payment: {
        cashfree: {
            clientId: (_j = process.env.CASHFREE_CLIENT_ID) !== null && _j !== void 0 ? _j : "",
            clientSecret: (_k = process.env.CASHFREE_CLIENT_SECRET) !== null && _k !== void 0 ? _k : "",
            url: process.env.CASHFREE_URL || "",
            version: process.env.CASHFREE_VERSION || "2023-08-01",
        },
    },
    nodemailer: {
        email: (_l = process.env.NODEMAILER_EMAIL) !== null && _l !== void 0 ? _l : "",
        password: (_m = process.env.NODEMAILER_PASS) !== null && _m !== void 0 ? _m : "",
        host: (_o = process.env.NODEMAILER_HOST) !== null && _o !== void 0 ? _o : "a",
        port: (_p = process.env.NODEMAILER_PORT) !== null && _p !== void 0 ? _p : 0,
    },
    sms: {
        fast2sms: {
            key: (_q = process.env.FAST2SMS_KEY) !== null && _q !== void 0 ? _q : "",
        },
    },
};
