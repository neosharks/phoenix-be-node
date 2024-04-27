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
cashfree_pg_1.Cashfree.XClientId = config_1.default.payment.cashfree.clientId;
cashfree_pg_1.Cashfree.XClientSecret = config_1.default.payment.cashfree.clientSecret;
cashfree_pg_1.Cashfree.XEnvironment = cashfree_pg_1.Cashfree.Environment.SANDBOX;
function generateOrderId() {
    const uniqueId = crypto_1.default.randomBytes(16).toString("hex");
    const hash = crypto_1.default.createHash("sha256");
    hash.update(uniqueId);
    const orderId = hash.digest("hex");
    return orderId.substr(0, 12);
}
class _PaymentController {
    order(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { packageId } = req.body;
            if (!packageId)
                return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
            const { id, firstName, lastName, username, phoneNumber, email } = res.locals.user;
            try {
                const foundPackage = yield package_service_1.PackageService.getOnePackage({ id: packageId });
                if (!foundPackage)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                const { price } = foundPackage;
                if (!price)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.INCORRECT_DATA });
                const order_id = yield generateOrderId();
                const request = {
                    order_amount: price,
                    order_currency: "INR",
                    order_id,
                    customer_details: {
                        customer_id: username,
                        customer_phone: phoneNumber,
                        customer_name: `${firstName} ${lastName}`,
                        customer_email: email,
                    },
                };
                let response;
                try {
                    response = yield cashfree_pg_1.Cashfree.PGCreateOrder("2023-08-01", request);
                    console.log(response);
                }
                catch (error) {
                    console.log(error);
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: "Payment failed" });
                }
                yield payment_service_1.PaymentService.createOnePayment({ userId: id, packageId, orderId: order_id });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, data: response === null || response === void 0 ? void 0 : response.data });
            }
            catch (error) {
                console.log(error);
                return res.status(api_constant_1.errorCode.INTERNAL_SERVER).json({ message: api_constant_1.errorMessage.INTERNAL_SERVER });
            }
        });
    }
    verify(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                if (!orderId)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const url = `https://sandbox.cashfree.com/pg/orders/${orderId}`;
                const headers = {
                    accept: "application/json",
                    "x-api-version": "2023-08-01",
                    "x-client-id": config_1.default.payment.cashfree.clientId,
                    "x-client-secret": config_1.default.payment.cashfree.clientSecret,
                };
                const response = yield axios_1.default.get(url, { headers });
                yield payment_service_1.PaymentService.updateOneByProps({ orderId }, { status: ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.order_status) || "FAILED" });
                return res.status(200).json({ status: (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.order_status });
            }
            catch (error) {
                console.log(error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
}
exports.PaymentController = new _PaymentController();
