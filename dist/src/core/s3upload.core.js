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
exports.GetUploadedFile = exports.getObjectSignedUrl = exports.deleteFile = exports.uploadFile = exports.generateFileName = exports.uploadFileMiddleware = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const jimp_1 = __importDefault(require("jimp"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../config"));
const bucketName = config_1.default.aws.bucketName;
const region = config_1.default.aws.region;
const accessKeyId = config_1.default.aws.accessId;
const secretAccessKey = config_1.default.aws.accessSecret;
const storage = multer_1.default.memoryStorage();
exports.uploadFileMiddleware = (0, multer_1.default)({ storage: storage });
const generateFileName = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
exports.generateFileName = generateFileName;
const s3Client = new client_s3_1.S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});
function uploadFile(fileBuffer, fileName, mimetype) {
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimetype,
    };
    return s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
}
exports.uploadFile = uploadFile;
function deleteFile(fileName) {
    const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
    };
    return s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams));
}
exports.deleteFile = deleteFile;
function getObjectSignedUrl(key) {
    return __awaiter(this, void 0, void 0, function* () {
        if (key.includes("phoenix-test-bucket"))
            return key;
        const params = {
            Bucket: bucketName,
            Key: key,
        };
        const command = new client_s3_1.GetObjectCommand(params);
        const seconds = 60;
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: seconds });
        return url;
    });
}
exports.getObjectSignedUrl = getObjectSignedUrl;
function GetUploadedFile(image) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!image || !image.buffer || !image.mimetype) {
                throw new Error("Invalid image data provided.");
            }
            const imageName = (0, exports.generateFileName)();
            const jimpImage = yield jimp_1.default.read(image.buffer);
            const buffer = yield jimpImage.getBufferAsync(image.mimetype);
            yield uploadFile(buffer, imageName, image.mimetype);
            return imageName;
        }
        catch (err) {
            console.log("Error in image upload", err);
            throw err;
        }
    });
}
exports.GetUploadedFile = GetUploadedFile;
