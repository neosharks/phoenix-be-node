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
const razorpay_1 = __importDefault(require("razorpay"));
const config_1 = __importDefault(require("../../config"));
const crypto_1 = __importDefault(require("crypto"));
const logger_core_1 = __importDefault(require("../core/logger.core"));
class _PaymentController {
    order(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new razorpay_1.default({
                    key_id: config_1.default.payment.razorpay.clientId,
                    key_secret: config_1.default.payment.razorpay.clientSecret,
                });
                const options = {
                    amount: req.body.amount * 100,
                    currency: "INR",
                    receipt: crypto_1.default.randomBytes(10).toString("hex"),
                };
                instance.orders.create(options, (error, order) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Something Went Wrong!" });
                    }
                    logger_core_1.default.info("order", order);
                    res.status(200).json({ data: order });
                });
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error!" });
                console.log(error);
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
                const sign = razorpay_order_id + "|" + razorpay_payment_id;
                const expectedSign = crypto_1.default
                    .createHmac("sha256", config_1.default.payment.razorpay.clientSecret)
                    .update(sign.toString())
                    .digest("hex");
                if (razorpay_signature === expectedSign) {
                    return res.status(200).json({ message: "Payment verified successfully" });
                }
                else {
                    return res.status(400).json({ message: "Invalid signature sent!" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error!" });
                console.log(error);
            }
        });
    }
}
exports.PaymentController = new _PaymentController();
