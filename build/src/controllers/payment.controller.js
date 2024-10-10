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
exports.PaymentController = void 0;
const cashfree_pg_1 = require("cashfree-pg");
const crypto_1 = __importDefault(require("crypto"));
const api_constant_1 = require("../constant/api.constant");
const package_service_1 = require("../services/package.service");
const config_1 = __importDefault(require("../../config"));
const axios_1 = __importDefault(require("axios"));
const payment_service_1 = require("../services/payment.service");
const package_controller_1 = require("./package.controller");
const class_service_1 = require("../services/class.service");
const wallet_service_1 = require("../services/wallet.service");
cashfree_pg_1.Cashfree.XClientId = config_1.default.payment.cashfree.clientId;
cashfree_pg_1.Cashfree.XClientSecret = config_1.default.payment.cashfree.clientSecret;
cashfree_pg_1.Cashfree.XEnvironment =
    config_1.default.payment.cashfree.environment === "PRODUCTION"
        ? cashfree_pg_1.Cashfree.Environment.PRODUCTION
        : cashfree_pg_1.Cashfree.Environment.SANDBOX;
function generateOrderId() {
    const uniqueId = crypto_1.default.randomBytes(16).toString("hex");
    const hash = crypto_1.default.createHash("sha256");
    hash.update(uniqueId);
    const orderId = hash.digest("hex");
    return orderId.substr(0, 12);
}
class _PaymentController {
    buyClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { classId } = req.body;
            if (!classId)
                return res
                    .status(api_constant_1.errorCode.GENERIC)
                    .json({ message: api_constant_1.errorMessage.MISSING_PARAMS, info: "Provide classId" });
            const { id, firstName, lastName, username, phoneNumber, email } = res.locals.user;
            try {
                const foundClass = yield class_service_1.ClassService.getOneClassByProps({ id: parseInt(classId, 10) });
                if (!foundClass)
                    return res
                        .status(api_constant_1.errorCode.GENERIC)
                        .send({ message: api_constant_1.errorMessage.NOT_FOUND, info: "Class not found" });
                const foundPayment = yield payment_service_1.PaymentService.getOnePaymentByProps({ userId: id, classId });
                if (foundPayment)
                    return res
                        .status(api_constant_1.errorCode.GENERIC)
                        .send({ message: api_constant_1.errorMessage.REDUNDANT_REQUEST, info: "Class already purchased" });
                const { price } = foundClass;
                if (!price)
                    return res
                        .status(api_constant_1.errorCode.GENERIC)
                        .send({ message: api_constant_1.errorMessage.INCORRECT_DATA, info: "Price not found" });
                const order_id = yield generateOrderId();
                const request = {
                    order_amount: price,
                    order_currency: "INR",
                    order_id,
                    customer_details: {
                        customer_id: username,
                        customer_phone: phoneNumber || "8174901463",
                        customer_name: `${firstName} ${lastName}`,
                        customer_email: email,
                    },
                };
                let response;
                try {
                    response = yield cashfree_pg_1.Cashfree.PGCreateOrder(config_1.default.payment.cashfree.version, request);
                }
                catch (error) {
                    console.error(error);
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: "Payment failed" });
                }
                yield payment_service_1.PaymentService.createOneClassPayment({
                    userId: id,
                    classId: parseInt(classId, 10),
                    orderId: order_id,
                    amount: price,
                    currency: "INR",
                });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, data: response === null || response === void 0 ? void 0 : response.data });
            }
            catch (error) {
                console.error(error);
                return res.status(api_constant_1.errorCode.INTERNAL_SERVER).json({ message: api_constant_1.errorMessage.INTERNAL_SERVER });
            }
        });
    }
    buyPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { packageId } = req.body;
            if (!packageId) {
                return res
                    .status(api_constant_1.errorCode.GENERIC)
                    .json({ message: api_constant_1.errorMessage.MISSING_PARAMS, info: "Provide packageId" });
            }
            const user = res.locals.user;
            try {
                const foundPackage = yield package_service_1.PackageService.getOnePackage({ id: packageId });
                if (!foundPackage) {
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                }
                const { price } = foundPackage;
                if (price === 0) {
                    yield (0, package_controller_1.AssignTierAndLink)(foundPackage, user);
                    return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS });
                }
                if (!price) {
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.INCORRECT_DATA });
                }
                const order_id = yield generateOrderId();
                const request = {
                    order_amount: price,
                    order_currency: "INR",
                    order_id,
                    customer_details: {
                        customer_id: user.username,
                        customer_phone: user.phoneNumber || "8174901463",
                        customer_name: `${user.firstName} ${user.lastName}`,
                        customer_email: user.email,
                    },
                };
                let response;
                try {
                    response = yield cashfree_pg_1.Cashfree.PGCreateOrder(config_1.default.payment.cashfree.version, request);
                }
                catch (error) {
                    console.error(error);
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: "Payment failed" });
                }
                // fix this
                yield payment_service_1.PaymentService.createOneClassPayment({
                    userId: user.id,
                    packageId,
                    orderId: order_id,
                    amount: price,
                    currency: "INR",
                });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, data: response === null || response === void 0 ? void 0 : response.data });
            }
            catch (error) {
                console.error(error);
                return res.status(api_constant_1.errorCode.INTERNAL_SERVER).json({ message: api_constant_1.errorMessage.INTERNAL_SERVER });
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { orderId } = req.body;
                if (!orderId)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundPayment = yield payment_service_1.PaymentService.getOnePaymentByProps({ orderId });
                if (!foundPayment)
                    return res
                        .status(api_constant_1.errorCode.NOT_FOUND)
                        .json({ message: api_constant_1.errorMessage.NOT_FOUND, info: "Payment not found" });
                const url = `${config_1.default.payment.cashfree.url}/orders/${orderId}`;
                const headers = {
                    accept: "application/json",
                    "x-api-version": config_1.default.payment.cashfree.version,
                    "x-client-id": config_1.default.payment.cashfree.clientId,
                    "x-client-secret": config_1.default.payment.cashfree.clientSecret,
                };
                const response = yield axios_1.default.get(url, { headers });
                yield payment_service_1.PaymentService.updateOneByProps({ orderId }, { status: ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.order_status) || "FAILED" });
                if (((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.order_status) === "PAID")
                    yield wallet_service_1.WalletService.createOneWalletTransactions({
                        receiverId: (_c = foundPayment === null || foundPayment === void 0 ? void 0 : foundPayment.class) === null || _c === void 0 ? void 0 : _c.creatorId,
                        senderId: foundPayment.userId,
                        source: "PURCHASE",
                        paymentId: foundPayment.id,
                        amount: foundPayment.amount,
                        currency: foundPayment.currency,
                        cashFlow: "CREDIT",
                        state: "CREDITED",
                    });
                return res.status(200).json({ status: (_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.order_status });
            }
            catch (error) {
                console.error(error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
}
exports.PaymentController = new _PaymentController();
