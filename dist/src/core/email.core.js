"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_core_1 = __importDefault(require("./logger.core"));
const sendEmail = (receiverEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.zohomail.in",
        port: 587,
        secure: false,
        auth: {
            user: "thakurzapezzy@zohomail.in",
            pass: "Dominaque$6",
        },
    });
    try {
        const info = yield transporter.sendMail({
            from: "thakurzapezzy@zohomail.in",
            to: "thakursatyam9415@gmail.com",
            subject: "Hello from Nodemailer",
            text: "Hello, this is a test email from Nodemailer!",
        });
        logger_core_1.default.info("Success ", info);
        return true;
    }
    catch (err) {
        logger_core_1.default.error(err);
        return false;
    }
});
exports.default = sendEmail;
