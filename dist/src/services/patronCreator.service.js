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
exports.PatronCreatorService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class _PatronCreatorService {
    getFirst(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.patronCreator.findFirst({ where: query });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.patronCreator.findUnique({ where: query });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll(query, skip = 0, take = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.patronCreator.findMany({
                    where: query,
                    include: {
                        package: true,
                        creator: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true,
                                email: true,
                                username: true,
                                industry: true,
                            },
                        },
                        patron: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true,
                                email: true,
                                username: true,
                                industry: true,
                            },
                        },
                    },
                    skip,
                    take,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.PatronCreatorService = new _PatronCreatorService();
