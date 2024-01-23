import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { PaymentController } from "../controllers/payment.controller";

const paymentRoutes = express.Router();

paymentRoutes.post("/order", checkRoleAuth(), PaymentController.order);

paymentRoutes.post("/verify", checkRoleAuth(), PaymentController.verify);

export default paymentRoutes;
