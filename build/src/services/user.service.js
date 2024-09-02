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
exports.UserService = void 0;
const allLinks_model_1 = __importDefault(require("../models/allLinks.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
class _UserService {
    getOneUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.findOne({ where: query });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllLinks(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield allLinks_model_1.default.findAll({ where: query });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createLink(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield allLinks_model_1.default.create(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllUserByParams(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, skip = 0, take = 10) {
            try {
                return yield user_model_1.default.findAll({
                    where: query,
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profileImage",
                        "email",
                        "username",
                        "role",
                        "industry",
                        "coverImage",
                    ],
                    offset: skip,
                    limit: take,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllUser() {
        return __awaiter(this, arguments, void 0, function* (skip = 0, take = 10) {
            try {
                return yield user_model_1.default.findAll({
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profileImage",
                        "email",
                        "username",
                        "phoneNumber",
                        "role",
                    ],
                    offset: skip,
                    limit: take,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllTotalUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.findAll();
            }
            catch (error) {
                throw error;
            }
        });
    }
    createOneUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.create(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateOneUser(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.update(data, { where: query });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteOneUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.destroy({ where: { id } });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserService = new _UserService();
