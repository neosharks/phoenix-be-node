import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";
import { WalletController } from "../controllers/wallet.controller";

const paymentRoutes = express.Router();

paymentRoutes.post("/getAll", checkRoleAuth([userRole.CREATOR]), WalletController.getAll);

paymentRoutes.post("/withdraw", checkRoleAuth([userRole.CREATOR]), WalletController.getAll);

export default paymentRoutes;
