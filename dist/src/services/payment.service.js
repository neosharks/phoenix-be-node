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
exports.PaymentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class _PaymentService {
    getAllPaymentByProps(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.payment.findMany({ where: query });
        });
    }
    getOnePaymentByProps(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.payment.findUnique({ where: query });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    createOnePayment(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, orderId, packageId, amount, currency } = dataValues;
                return yield prisma_1.default.payment.create({
                    data: {
                        userId,
                        orderId,
                        packageId,
                        amount,
                        currency,
                    },
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateOneByProps(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.payment.update({ where: query, data: data });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.PaymentService = new _PaymentService();
