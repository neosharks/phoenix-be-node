import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";
import { WalletController } from "../controllers/wallet.controller";

const walletRoutes = express.Router();

walletRoutes.post("/getAll", checkRoleAuth([userRole.CREATOR]), WalletController.getAll);

walletRoutes.post("/withdraw", checkRoleAuth([userRole.CREATOR]), WalletController.getAll);

export default walletRoutes;
