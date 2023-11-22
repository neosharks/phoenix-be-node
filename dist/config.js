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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.default = {
    main: {
        environment: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "",
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
};
