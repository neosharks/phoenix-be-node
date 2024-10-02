import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";
import { WalletController } from "../controllers/wallet.controller";

const walletRoutes = express.Router();

// -----------  GET ----------------

walletRoutes.get("/getAll", checkRoleAuth([userRole.CREATOR]), WalletController.getAll);

// -----------  POST ----------------

walletRoutes.post("/withdraw", checkRoleAuth([userRole.CREATOR]), WalletController.withdraw);

export default walletRoutes;
