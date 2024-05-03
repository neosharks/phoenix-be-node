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
const prisma_1 = __importDefault(require("../../prisma"));
class _UserService {
    getOneUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.findUnique({ where: query });
        });
    }
    getAllUserByParams(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.findMany({
                where: query,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    email: true,
                    username: true,
                    role: true,
                    industry: true,
                    coverImage: true,
                },
            });
        });
    }
    getAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    email: true,
                    username: true,
                    phoneNumber: true,
                    role: true,
                },
            });
        });
    }
    createOneUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.create({ data: data });
        });
    }
    updateOneUser(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.update({ where: query, data: data });
        });
    }
    deleteOneUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.delete({ where: { id } });
        });
    }
}
exports.UserService = new _UserService();
