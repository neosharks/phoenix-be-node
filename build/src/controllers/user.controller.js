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
    getAllLinks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                if (!username || typeof username !== "string")
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const found = yield user_service_1.UserService.getOneUser({ username });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                const allLinks = yield user_service_1.UserService.getAllLinks({ id: found.id });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, allLinks });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    createLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url, platform, highlight } = req.body;
                const { id } = res.locals.user;
                if (!url)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                yield user_service_1.UserService.createLink({ userId: id, url, platform, highlight });
                return res.status(200).json({ message: api_constant_1.successMessages.CREATED });
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
                if (!username || typeof username !== "string")
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const found = yield user_service_1.UserService.getOneUser({ username });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
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
                const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
                const take = Number(req.query.per_page) || 10;
                let found = yield user_service_1.UserService.getAllUserByParams({ isCreator: true }, skip, take);
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                found = found.filter((ele) => ele.id !== id);
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
                const image = req.body.image;
                let update = {};
                if (image)
                    update.coverImage = image;
                console.log(update, "sdfg");
                yield user_service_1.UserService.updateOneUser({ id: res.locals.user.id }, update);
                return res.status(200).json({ message: "UPDATED" });
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
                const image = req.body.image;
                let update = {};
                if (image)
                    update.profileImage = image;
                yield user_service_1.UserService.updateOneUser({ id: res.locals.user.id }, update);
                return res.status(200).json({ message: "UPDATED" });
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
                const validation = user_validator_1.userUpdateSchema.validate(req.body);
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                const image = req.body.image;
                if (image)
                    req.body.profileImage = image;
                yield user_service_1.UserService.updateOneUser({ id: res.locals.user.id }, req.body);
                return res.status(200).json({ message: "UPDATED" });
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
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundPatronCreator = yield patronCreator_service_1.PatronCreatorService.getFirst({
                    creatorId,
                    patronId: user.id,
                    type: "FREE",
                });
                if (foundPatronCreator)
                    return res.status(400).send({ message: api_constant_1.errorMessage.REDUNDANT_REQUEST });
                yield package_service_1.PackageService.linkPatronCreator(user.id, creatorId, "FREE", undefined);
                return res.status(200).json({ message: "UPDATED" });
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
                const { id, username } = res.locals.user;
                const validation = user_validator_1.userUpdateSchema.validate(req.body);
                if (validation.error)
                    return res.status(400).json({ error: validation.error.details[0].message });
                const foundUser = yield user_service_1.UserService.getOneUser({ id });
                if (!foundUser)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                if (foundUser.role.includes("CREATOR"))
                    return res.status(400).send({ message: api_constant_1.errorMessage.REDUNDANT_REQUEST });
                const foundUsername = yield user_service_1.UserService.getOneUser({ username });
                if (foundUsername && foundUsername.id !== id)
                    return res.status(400).send({ message: api_constant_1.errorMessage.DUPLICATE_USERNAME });
                // Ensure email uniqueness check before update
                if (req.body.email) {
                    const existingUserWithEmail = yield user_service_1.UserService.getOneUser({ email: req.body.email });
                    if (existingUserWithEmail && existingUserWithEmail.id !== id)
                        return res.status(400).send({ message: "Email already exists" });
                }
                const updatedBody = Object.assign(Object.assign({}, req.body), { creatorApprovalStatus: "PENDING" });
                yield user_service_1.UserService.updateOneUser({ id }, updatedBody);
                // const emailSent = await emailQueue.add({
                //   receiverEmail: req.body.email,
                //   subject: "Creator Application Under Review",
                //   template: "APPLY_CREATOR",
                //   variables: {},
                // });
                // if (!emailSent) {
                //   return res.status(500).send({ message: "Failed to send email" });
                // }
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
    approveCreatorOnboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { users } = req.body;
                for (let i = 0; i < users.length; i++) {
                    const ele = users[i];
                    const foundUser = yield user_service_1.UserService.getOneUser({ id: ele });
                    if (foundUser && !foundUser.isCreator) {
                        const updatedBody = {
                            isCreator: true,
                            role: ["CREATOR", ...foundUser.role],
                            creatorApprovalStatus: "APPROVED",
                            creatorChangeTimeStamp: new Date(),
                        };
                        yield user_service_1.UserService.updateOneUser({ id: ele }, updatedBody);
                        // await emailQueue.add({
                        //   receiverEmail: foundUser.email,
                        //   subject: "Application Approval",
                        //   template: "APPROVE_CREATOR",
                        //   variables: {},
                        // });
                    }
                }
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
    getAllTotalUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const found = yield user_service_1.UserService.getAllTotalUser();
                if (!found)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
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
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = res.locals.user;
                const deletedUser = yield user_service_1.UserService.deleteOneUser(parseInt(id));
                if (deletedUser)
                    return res.status(200).json({ message: api_constant_1.successMessages.DELETE });
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
