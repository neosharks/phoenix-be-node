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
exports.getBlurredImage = void 0;
const jimp_1 = __importDefault(require("jimp"));
const s3upload_core_1 = require("../core/s3upload.core");
const BLUR_NUMBER = 70;
const getBlurredImage = (incomingImage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signedUrl = yield (0, s3upload_core_1.getObjectSignedUrl)(incomingImage);
        const image = yield jimp_1.default.read(signedUrl);
        image.blur(BLUR_NUMBER);
        const blurredImageBase64 = yield image.getBase64Async(jimp_1.default.AUTO);
        return blurredImageBase64;
    }
    catch (err) {
        console.log("Error in blurring", err);
        return "";
    }
});
exports.getBlurredImage = getBlurredImage;
