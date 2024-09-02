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
const patronCreator_model_1 = __importDefault(require("../models/patronCreator.model"));
class _PatronCreatorService {
    getFirst(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield patronCreator_model_1.default.findOne({ where: query });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield patronCreator_model_1.default.findOne({
                    where: query,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, skip = 0, take = 10) {
            try {
                return yield patronCreator_model_1.default.findAll({
                    where: query,
                    include: [
                        {
                            model: "Package",
                            as: "package",
                        },
                        {
                            model: "User",
                            as: "creator",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "profileImage",
                                "email",
                                "username",
                                "industry",
                            ],
                        },
                        {
                            model: "User",
                            as: "patron",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "profileImage",
                                "email",
                                "username",
                                "industry",
                            ],
                        },
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
}
exports.PatronCreatorService = new _PatronCreatorService();
