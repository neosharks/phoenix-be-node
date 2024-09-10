import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { PaymentController } from "../controllers/payment.controller";

const paymentRoutes = express.Router();

paymentRoutes.post("/buyClass", checkRoleAuth(), PaymentController.buyClass);

paymentRoutes.post("/buyPackage", checkRoleAuth(), PaymentController.buyPackage);

paymentRoutes.post("/verify", checkRoleAuth(), PaymentController.verify);

export default paymentRoutes;
