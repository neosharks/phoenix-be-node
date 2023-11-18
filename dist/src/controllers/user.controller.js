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
class _UserController {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = res.locals.user.id;
            const found = yield user_service_1.UserService.getOneUser({ id });
            return res.status(201).send({ message: "success", user: found });
        });
    }
    getUserByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            if (!username)
                return res.status(400).send({ message: "provide username" });
            const found = yield user_service_1.UserService.getOneUser({ username });
            if (!found)
                return res.status(404).send({ message: "user cannot be found" });
            return res.status(200).send({ message: "success", user: found });
        });
    }
    creatorOnboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = res.locals.user.id;
            const { pageName, industry, gender, description, youtubeHandle, instagramHandle, facebookHandle, twitterHandle, } = req.body;
            const foundUser = yield user_service_1.UserService.getOneUser({ id });
            if (!foundUser)
                return res.status(404).send({ message: "User not found" });
            if (foundUser.role.includes("CREATOR"))
                return res.status(400).send({ message: "Already a creator" });
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
            return res.status(201).send({ message: "Success" });
        });
    }
}
exports.UserController = new _UserController();
