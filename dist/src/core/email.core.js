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
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const logger_core_1 = __importDefault(require("./logger.core"));
const config_1 = __importDefault(require("../../config"));
const extractTemplate = (template) => {
    switch (template) {
        case "SIGNUP":
            return "signup.mail.ejs";
        case "FORGET_PASSWORD":
            return "forgetPassword.mail.ejs";
        default:
            return "default.mail.ejs";
    }
};
const sendEmail = (receiverEmail, subject, template, variables) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailTransport = nodemailer_1.default.createTransport({
            host: config_1.default.nodemailer.host,
            port: config_1.default.nodemailer.port,
            secure: true,
            auth: {
                user: config_1.default.nodemailer.email,
                pass: config_1.default.nodemailer.password,
            },
        });
        const templatePath = path_1.default.join(__dirname, `../mailTemplates/${extractTemplate(template)}`);
        const foundTemplate = yield ejs_1.default.renderFile(templatePath, variables);
        const mailOptions = {
            from: `admin@qalakar.com`,
            to: receiverEmail,
            subject: subject,
            html: foundTemplate,
        };
        logger_core_1.default.info(`Sending email to ${receiverEmail}`);
        yield mailTransport.sendMail(mailOptions);
        logger_core_1.default.info(`Email sent to ${receiverEmail}`);
        return true;
    }
    catch (err) {
        logger_core_1.default.error("Failed to send email", err);
        return false;
    }
});
exports.default = sendEmail;
