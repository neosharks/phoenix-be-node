"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const payment_controller_1 = require("../controllers/payment.controller");
const paymentRoutes = express_1.default.Router();
paymentRoutes.post("/order", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), payment_controller_1.PaymentController.order);
paymentRoutes.post("/verify", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), payment_controller_1.PaymentController.verify);
exports.default = paymentRoutes;
