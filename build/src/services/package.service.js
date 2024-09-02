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
exports.PackageService = void 0;
const sequelize_1 = require("../models/sequelize");
const { Package, Tier, PatronCreator } = sequelize_1.db;
class _PackageService {
    getAllPackagesOfCreator(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, skip = 0, take = 10) {
            try {
                return yield Package.findAll({
                    where: {
                        creator: { username: query.username },
                    },
                    include: [{ model: Tier }],
                    offset: skip,
                    limit: take,
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getOnePackage(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Package.findOne({ where: query, include: [{ model: Tier }] });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    createOnePackage(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tier, name, price, description, creatorId } = dataValues;
                const newPackage = yield Package.create({
                    name,
                    price,
                    description,
                    creatorId,
                });
                if (tier && tier.length > 0) {
                    yield newPackage.setTiers(tier);
                }
                return newPackage;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    updatePackage(props, dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Package.update(dataValues, { where: props });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAllTiers() {
        return __awaiter(this, arguments, void 0, function* (skip = 0, take = 10) {
            try {
                return yield Tier.findAll({
                    offset: skip,
                    limit: take,
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    createOneTier(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Tier.create(data);
            }
            catch (error) {
                console.error(error);
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
                return yield PatronCreator.create({
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
                console.error(error);
                throw error;
            }
        });
    }
    getAllPurchasedByPatron(patronId, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield PatronCreator.findAll({
                    where: { patronId, creatorId },
                    include: [
                        {
                            model: Package,
                            include: [{ model: Tier }],
                        },
                    ],
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.PackageService = new _PackageService();
