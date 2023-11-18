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
    getAllPackagesByUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.package.findMany({ where: query, include: { tier: true } });
        });
    }
    getAllPatronCreatorByUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.patronCreator.findMany();
        });
    }
    getOnePackage(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.package.findUnique({ where: query, include: { tier: true } });
        });
    }
    createOnePackage(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tier, name, price, description, userId } = dataValues;
            return yield prisma_1.default.package.create({
                data: {
                    name,
                    image: "https://random.imagecdn.app/500/150",
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
        });
    }
    //------------------------
    getAllTiers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.tier.findMany({});
        });
    }
    createOneTier(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.tier.create({ data: data });
        });
    }
    linkPatronCreator(creatorId, patronId, packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTimestamp = Date.now();
            const dateObject = new Date(currentTimestamp);
            return yield prisma_1.default.patronCreator.create({
                data: { patronId, packageId, creatorId, expiry: dateObject },
            });
        });
    }
}
exports.PackageService = new _PackageService();
