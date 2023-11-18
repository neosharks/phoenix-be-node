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
exports.UserPostController = void 0;
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const userPost_service_1 = require("../services/userPost.service");
class _UserPostController {
    getAllUserPostByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorId } = req.query;
            if (!authorId)
                return res.status(400).send({ message: "provide authorId" });
            const found = yield userPost_service_1.UserPostService.getAllUserPostByUser({
                authorId,
            });
            if (!found)
                return res.status(404).send({ message: "user post cannot be found" });
            return res.status(200).send({ message: "success", data: found });
        });
    }
    getOneUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            if (!id)
                return res.status(400).send({ message: "provide id" });
            const found = yield userPost_service_1.UserPostService.getOneUserPost({ id });
            if (!found)
                return res.status(404).send({ message: "User Post not found" });
            return res.status(201).send({ message: "success", data: found });
        });
    }
    createOneUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, authorId } = req.body;
            const UploadFile = req.file;
            console.log(UploadFile);
            if (!body || !authorId)
                return res.status(400).send({ message: "Incomplete params" });
            let uploadUrl = undefined;
            yield userPost_service_1.UserPostService.createOneUserPost(Object.assign(Object.assign({}, req.body), { image: uploadUrl }));
            res.status(201).send({ message: "created" });
        });
    }
}
exports.UserPostController = new _UserPostController();
