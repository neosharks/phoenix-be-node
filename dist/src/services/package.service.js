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
exports.PackageService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class _PackageService {
    getAllPackagesOfCreator(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.package.findMany({ where: query, include: { tier: true } });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getOnePackage(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.package.findUnique({ where: query, include: { tier: true } });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    createOnePackage(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tier, name, price, description, userId } = dataValues;
                return yield prisma_1.default.package.create({
                    data: {
                        name,
                        price,
                        description,
                        userId,
                        tier: {
                            connect: tier.map((ele) => {
                                return { id: ele };
                            }),
                        },
                    },
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    //------------------------
    getAllTiers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.tier.findMany({});
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    createOneTier(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.tier.create({ data: data });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    linkPatronCreator(patronId, creatorId, type, packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentDate = new Date();
                const expiryDate = new Date(currentDate);
                expiryDate.setMonth(expiryDate.getMonth() + 1);
                return yield prisma_1.default.patronCreator.create({
                    data: {
                        patronId,
                        creatorId,
                        packageId,
                        status: "ACTIVE",
                        type,
                        expiry: type !== "FREE" ? expiryDate : null,
                    },
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllPurchasedByPatron(patronId, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.patronCreator.findMany({
                    where: { patronId, creatorId },
                    include: {
                        package: {
                            include: { tier: true },
                        },
                    },
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.PackageService = new _PackageService();
