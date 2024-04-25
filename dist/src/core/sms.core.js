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
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
function sendOtpSms(phoneNumber, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post("https://www.fast2sms.com/dev/bulkV2", {
                variables_values: otp,
                route: "dlt",
                numbers: phoneNumber,
                message: `Your otp: ${otp}`,
                sender_id: "AX-QKROTP",
            }, {
                headers: {
                    authorization: config_1.default.sms.fast2sms.key,
                },
            });
            console.log(response.data);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
exports.default = sendOtpSms;
