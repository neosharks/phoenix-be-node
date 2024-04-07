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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const logger_core_1 = __importDefault(require("../core/logger.core"));
const api_constant_1 = require("../constant/api.constant");
const s3upload_core_1 = require("../core/s3upload.core");
const jimp_1 = __importDefault(require("jimp"));
class _UserController {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.user.id;
                const found = yield user_service_1.UserService.getOneUser({ id });
                if (found === null || found === void 0 ? void 0 : found.profileImage)
                    found.profileImage = yield (0, s3upload_core_1.getObjectSignedUrl)(found.profileImage);
                return res.status(201).send({ message: api_constant_1.successMessages.SUCCESS, user: found });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getUserByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                if (!username)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const found = yield user_service_1.UserService.getOneUser({ username });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, user: found });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllCreator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const found = yield user_service_1.UserService.getAllUserByParams({ isCreator: true });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, data: found });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { profileImage } = _a, update = __rest(_a, ["profileImage"]);
                if (profileImage) {
                    const imageName = (0, s3upload_core_1.generateFileName)();
                    const jimpImage = yield jimp_1.default.read(profileImage.buffer);
                    const buffer = yield jimpImage.getBufferAsync(profileImage.mimetype);
                    yield (0, s3upload_core_1.uploadFile)(buffer, imageName, profileImage.mimetype);
                    update.profileImage = imageName;
                }
                yield user_service_1.UserService.updateOneUser({ id: res.locals.user.id }, update);
                return res.status(200).json({ message: api_constant_1.successMessages.UPDATED });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    creatorOnboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.user.id;
                const { pageName, industry, gender, description, youtubeHandle, instagramHandle, facebookHandle, twitterHandle, } = req.body;
                const foundUser = yield user_service_1.UserService.getOneUser({ id });
                if (!foundUser)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                if (foundUser.role.includes("CREATOR"))
                    return res.status(400).send({ message: api_constant_1.errorMessage.REDUNDANT_REQUEST });
                const updatedBody = {
                    pageName,
                    industry,
                    gender,
                    bio: description,
                    youtubeHandle,
                    instagramHandle,
                    facebookHandle,
                    twitterHandle,
                    isCreator: true,
                    role: ["CREATOR", ...foundUser.role],
                };
                yield user_service_1.UserService.updateOneUser({ id }, updatedBody);
                return res.status(201).send({ message: api_constant_1.successMessages.SUCCESS });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
}
exports.UserController = new _UserController();
