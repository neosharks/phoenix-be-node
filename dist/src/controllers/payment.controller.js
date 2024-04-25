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
const { Cashfree } = require("cashfree-pg");
const crypto_1 = __importDefault(require("crypto"));
const logger_core_1 = __importDefault(require("../core/logger.core"));
const api_constant_1 = require("../constant/api.constant");
const package_service_1 = require("../services/package.service");
const config_1 = __importDefault(require("../../config"));
const axios_1 = __importDefault(require("axios"));
const payment_service_1 = require("../services/payment.service");
function generateOrderId() {
    const uniqueId = crypto_1.default.randomBytes(16).toString("hex");
    const hash = crypto_1.default.createHash("sha256");
    hash.update(uniqueId);
    const orderId = hash.digest("hex");
    return orderId.substr(0, 12);
}
Cashfree.XClientId = config_1.default.payment.cashfree.clientId;
Cashfree.XClientSecret = config_1.default.payment.cashfree.clientSecret;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
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
                    order_meta: {
                        return_url: `${config_1.default.main.feUrl}?order_id=order_123`,
                    },
                };
                const response = yield Cashfree.PGCreateOrder("2023-08-01", request);
                yield payment_service_1.PaymentService.createOnePayment({ userId: id, packageId, orderId: order_id });
                return res.status(200).json(response.data);
            }
            catch (error) {
                logger_core_1.default.error(error);
                res.status(500).json({ message: "Internal Server Error!" });
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
                    "x-client-id": "TEST10176358cd94ce5cae97557aca3485367101",
                    "x-client-secret": "cfsk_ma_test_b604f570fc3f1a2027c863b05db9cfd5_3dc55ce4",
                };
                const response = yield axios_1.default.get(url, { headers });
                yield payment_service_1.PaymentService.updateOneByProps({ orderId }, { status: ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.order_status) || "FAILED" });
                return res.status(200).json({ status: (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.order_status });
            }
            catch (error) {
                logger_core_1.default.error(error);
                res.status(500).json({ message: "Internal Server Error!" });
            }
        });
    }
}
exports.PaymentController = new _PaymentController();
