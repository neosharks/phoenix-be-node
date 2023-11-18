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
exports.PackageController = void 0;
const package_service_1 = require("../services/package.service");
const conversation_service_1 = require("../services/conversation.service");
class _PackageController {
    getAllPackagesByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            if (!username)
                return res.status(400).send({ message: "provide username" });
            const found = yield package_service_1.PackageService.getAllPackagesByUser({
                User: {
                    username: username,
                },
            });
            if (!found)
                return res.status(404).send({ message: "packages cannot be found" });
            return res.status(200).send({ message: "success", packages: found });
        });
    }
    getOnePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            const found = yield package_service_1.PackageService.getOnePackage({ id });
            if (!found)
                return res.status(404).send({ message: "Package not found" });
            return res.status(201).send({ message: "success", data: found });
        });
    }
    createOnePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            yield package_service_1.PackageService.createOnePackage(body);
            res.status(201).send({ message: "created" });
        });
    }
    buyPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { packageId } = req.body;
            if (!packageId)
                return res.status(400).send({ message: "Provide package id" });
            const user = res.locals.user;
            const foundPackage = yield package_service_1.PackageService.getOnePackage({ id: packageId });
            if (!foundPackage)
                return res.status(404).send({ message: "Package not found" });
            const { tier, userId } = foundPackage;
            const tierUserPackage = yield package_service_1.PackageService.getOnePackage({ id: packageId, userId: user.id });
            if (tierUserPackage)
                return res.status(400).send({ message: "User cannot purchase his own package" });
            yield package_service_1.PackageService.linkPatronCreator(foundPackage.userId, user.id, packageId);
            tier &&
                tier.length > 0 &&
                tier.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    if (ele.tierType === "UNLIMITED_MESSAGE") {
                        yield conversation_service_1.ConversationService.createOneConversation([user.id, userId]);
                    }
                    if (ele.tierType === "GENERAL_SUPPORT") {
                        //
                    }
                    if (ele.tierType === "EARLY_TICKETS") {
                        //
                    }
                    if (ele.tierType === "DIGITAL_DOWNLOADS") {
                        //
                    }
                    if (ele.tierType === "BEHIND_THE_SCENES") {
                        //
                    }
                }));
            return res.status(201).send({ message: "success" });
        });
    }
    //----------------------------
    createOneTier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            yield package_service_1.PackageService.createOneTier(body);
            res.status(201).send({ message: "created" });
        });
    }
    createManyTier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tiers } = req.body;
            tiers.map((ele) => __awaiter(this, void 0, void 0, function* () {
                yield package_service_1.PackageService.createOneTier(ele);
            }));
            res.status(201).send({ message: "created" });
        });
    }
    getAllTiers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tiers = yield package_service_1.PackageService.getAllTiers();
            res.status(201).send({ message: "succcess", tiers: tiers });
        });
    }
}
exports.PackageController = new _PackageController();
