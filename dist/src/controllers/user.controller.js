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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const api_constant_1 = require("../constant/api.constant");
const s3upload_core_1 = require("../core/s3upload.core");
const package_service_1 = require("../services/package.service");
const patronCreator_service_1 = require("../services/patronCreator.service");
const user_validator_1 = require("../validators/user.validator");
class _UserController {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.user.id;
                const found = yield user_service_1.UserService.getOneUser({ id });
                if (!found)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                if (found.profileImage)
                    found.profileImage = yield (0, s3upload_core_1.getObjectSignedUrl)(found.profileImage);
                if (found.coverImage)
                    found.coverImage = yield (0, s3upload_core_1.getObjectSignedUrl)(found.coverImage);
                return res.status(201).send({ message: api_constant_1.successMessages.SUCCESS, user: found });
            }
            catch (error) {
                console.log("ERROR: ", error);
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
                if (found.coverImage)
                    found.coverImage = yield (0, s3upload_core_1.getObjectSignedUrl)(found.coverImage);
                if (found.profileImage)
                    found.profileImage = yield (0, s3upload_core_1.getObjectSignedUrl)(found.profileImage);
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, user: found });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllCreator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = res.locals.user;
                let found = yield user_service_1.UserService.getAllUserByParams({ isCreator: true });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                found = found.filter((ele) => ele.id !== id);
                if (found.length > 0) {
                    found = yield Promise.all(found.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b;
                        if (((_a = ele === null || ele === void 0 ? void 0 : ele.profileImage) === null || _a === void 0 ? void 0 : _a.length) > 0)
                            ele.profileImage = yield (0, s3upload_core_1.getObjectSignedUrl)(ele.profileImage);
                        if (((_b = ele === null || ele === void 0 ? void 0 : ele.coverImage) === null || _b === void 0 ? void 0 : _b.length) > 0)
                            ele.coverImage = yield (0, s3upload_core_1.getObjectSignedUrl)(ele.coverImage);
                        return ele;
                    })));
                }
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, data: found });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    updateCoverImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = req.file;
                let update = {};
                console.log(image);
                if (image)
                    update.coverImage = yield (0, s3upload_core_1.GetUploadedFile)(image);
                yield user_service_1.UserService.updateOneUser({ id: res.locals.user.id }, update);
                return res.status(200).json({ message: api_constant_1.successMessages.UPDATED });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    updateProfileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = req.file;
                let update = {};
                console.log(image);
                if (image)
                    update.profileImage = yield (0, s3upload_core_1.GetUploadedFile)(image);
                yield user_service_1.UserService.updateOneUser({ id: res.locals.user.id }, update);
                return res.status(200).json({ message: api_constant_1.successMessages.UPDATED });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { update } = req.body;
                const validation = user_validator_1.userUpdateSchema.validate(update, { stripUnknown: true });
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                const image = req.file;
                if (image)
                    update.profileImage = yield (0, s3upload_core_1.GetUploadedFile)(image);
                yield user_service_1.UserService.updateOneUser({ id: res.locals.user.id }, update);
                return res.status(200).json({ message: api_constant_1.successMessages.UPDATED });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    joinForFree(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = res.locals;
                const { creatorId } = req.body;
                if (!creatorId)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundPatronCreator = yield patronCreator_service_1.PatronCreatorService.getFirst({
                    creatorId,
                    patronId: user.id,
                    type: "FREE",
                });
                if (foundPatronCreator)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.REDUNDANT_REQUEST });
                yield package_service_1.PackageService.linkPatronCreator(user.id, creatorId, "FREE", undefined);
                return res.status(200).json({ message: api_constant_1.successMessages.UPDATED });
            }
            catch (error) {
                console.log("ERROR: ", error);
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
                const { data } = req.body;
                const validation = user_validator_1.userUpdateSchema.validate(data, { stripUnknown: true });
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                const foundUser = yield user_service_1.UserService.getOneUser({ id });
                if (!foundUser)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                if (foundUser.role.includes("CREATOR"))
                    return res.status(400).send({ message: api_constant_1.errorMessage.REDUNDANT_REQUEST });
                const updatedBody = Object.assign(Object.assign({}, data), { isCreator: true, role: ["CREATOR", ...foundUser.role] });
                yield user_service_1.UserService.updateOneUser({ id }, updatedBody);
                return res.status(201).send({ message: api_constant_1.successMessages.SUCCESS });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = res.locals.user;
                yield user_service_1.UserService.deleteOneUser(id);
                return res.status(200).json({ messge: api_constant_1.successMessages.SUCCESS });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
}
exports.UserController = new _UserController();
