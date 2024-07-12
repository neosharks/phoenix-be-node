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
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const logger_core_1 = __importDefault(require("./logger.core"));
const config_1 = __importDefault(require("../../config"));
const extractTemplate = (template) => {
    switch (template) {
        case "SIGNUP":
            return "signup.mail.html";
        case "FORGET_PASSWORD":
            return "forgetPassword.mail.html";
        case "APPLY_CREATOR":
            return "applyForCreator.mail.html";
        case "APPROVE_CREATOR":
            return "approvalForCreator.mail.html";
        default:
            return "default.mail.html";
    }
};
const sendEmail = (receiverEmail_1, subject_1, template_1, ...args_1) => __awaiter(void 0, [receiverEmail_1, subject_1, template_1, ...args_1], void 0, function* (receiverEmail, subject, template, variables = {}) {
    try {
        const mailTransport = nodemailer_1.default.createTransport({
            host: config_1.default.nodemailer.host,
            port: config_1.default.nodemailer.port,
            secure: true,
            connectionTimeout: 5000,
            auth: {
                user: config_1.default.nodemailer.email,
                pass: config_1.default.nodemailer.password,
            },
        });
        const templatePath = path_1.default.join(__dirname, `../mailTemplates/${extractTemplate(template)}`);
        logger_core_1.default.info(`Reading email template from ${templatePath}`);
        let foundTemplate = yield promises_1.default.readFile(templatePath, "utf8");
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, "g");
            foundTemplate = foundTemplate.replace(regex, value);
        }
        const mailOptions = {
            from: `admin@qalakar.com`,
            to: receiverEmail,
            subject: subject,
            html: foundTemplate,
        };
        console.info(`Sending email to ${receiverEmail} with subject ${subject}`);
        yield mailTransport.sendMail(mailOptions);
        logger_core_1.default.info(`Email sent to ${receiverEmail}`);
        return true;
    }
    catch (err) {
        console.error("Failed to send email", err);
        return false;
    }
});
exports.default = sendEmail;
