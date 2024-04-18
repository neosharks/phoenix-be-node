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
exports.PackageController = void 0;
const package_service_1 = require("../services/package.service");
const chat_service_1 = require("../services/chat.service");
const patronCreator_service_1 = require("../services/patronCreator.service");
const api_constant_1 = require("../constant/api.constant");
const logger_core_1 = __importDefault(require("../core/logger.core"));
class _PackageController {
    getAllPackagesOfCreator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                if (!username)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const found = yield package_service_1.PackageService.getAllPackagesOfCreator({
                    User: {
                        username: username,
                    },
                });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, packages: found });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getOnePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const found = yield package_service_1.PackageService.getOnePackage({ id });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                return res.status(201).send({ message: api_constant_1.successMessages.SUCCESS, data: found });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getPackageNames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(201).send({
                    message: api_constant_1.successMessages.SUCCESS,
                    data: ["SUPPORT", "BROZE", "SILVER", "GOLD", "PLATINUM", "RUBY"],
                });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    useGetAllSubscriptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                if (!username)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const found = yield patronCreator_service_1.PatronCreatorService.getAll({
                    patron: {
                        username: username,
                    },
                });
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
    getAllPatronsByCreator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                if (!username)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const found = yield patronCreator_service_1.PatronCreatorService.getAll({
                    creator: {
                        username: username,
                    },
                });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                return res.status(201).send({ message: api_constant_1.successMessages.SUCCESS, data: found });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    createOnePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = res.locals.user;
                const { tier, name, price, description } = req.body;
                const allUserPackages = yield package_service_1.PackageService.getAllPackagesOfCreator({ userId: id });
                const packageIndex = allUserPackages.findIndex((pac) => pac.name === name);
                if (packageIndex !== -1)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.DUPLICATE_ENTRY });
                yield package_service_1.PackageService.createOnePackage({ tier, name, price, description, userId: id });
                res.status(201).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    buyPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageId } = req.body;
                if (!packageId)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const user = res.locals.user;
                const foundPackage = yield package_service_1.PackageService.getOnePackage({ id: packageId });
                if (!foundPackage)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                const { tier, userId } = foundPackage;
                const tierUserPackage = yield package_service_1.PackageService.getOnePackage({
                    id: packageId,
                    userId: user.id,
                });
                if (tierUserPackage)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_ALLOWED });
                const foundAlreadyPurchase = yield patronCreator_service_1.PatronCreatorService.getFirst({
                    patronId: user.id,
                    creatorId: userId,
                    packageId: foundPackage.id,
                });
                if (foundAlreadyPurchase)
                    return res.status(400).send({ message: api_constant_1.errorMessage.REDUNDANT_REQUEST });
                tier &&
                    tier.length > 0 &&
                    tier.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        if (ele.tierType === "ONE_TIME_MESSAGE") {
                            const foundChat = yield chat_service_1.ChatService.getOneChat({
                                OR: [
                                    { participantOneId: user.id, participantTwoId: userId },
                                    { participantOneId: userId, participantTwoId: user.id },
                                ],
                            });
                            if (!foundChat)
                                yield chat_service_1.ChatService.createOneChat([user.id, userId], "LIMITED");
                            else
                                yield chat_service_1.ChatService.updateOneChat({ id: foundChat.id }, { pendingAllowed: foundChat.pendingAllowed + 1 });
                        }
                        if (ele.tierType === "UNLIMITED_MESSAGE") {
                            const foundChat = yield chat_service_1.ChatService.getOneChat({
                                OR: [
                                    { participantOneId: user.id, participantTwoId: userId },
                                    { participantOneId: userId, participantTwoId: user.id },
                                ],
                            });
                            if (!foundChat)
                                yield chat_service_1.ChatService.createOneChat([user.id, userId], "UNLIMITED");
                            else
                                yield chat_service_1.ChatService.updateOneChat({ id: foundChat.id }, { pendingAllowed: foundChat.pendingAllowed + 1000 });
                        }
                    }));
                yield package_service_1.PackageService.linkPatronCreator(user.id, foundPackage.userId, "PAID", packageId);
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
    //----------------------------
    createOneTier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                yield package_service_1.PackageService.createOneTier(body);
                res.status(201).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    createManyTier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tiers } = req.body;
                tiers.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    yield package_service_1.PackageService.createOneTier(ele);
                }));
                res.status(201).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllTiers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tiers = yield package_service_1.PackageService.getAllTiers();
                res.status(201).send({ message: api_constant_1.successMessages.FETCHED, tiers: tiers });
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
exports.PackageController = new _PackageController();
