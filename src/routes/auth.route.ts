import express from "express";
//----------------------------------
import { AuthController } from "../controllers/auth.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";

const authRoutes = express.Router();

// -----------  POST ----------------

authRoutes.post("/register", AuthController.register);

authRoutes.post("/login", AuthController.login);

authRoutes.post("/sendOtp", AuthController.sendOtp);

authRoutes.post("/resendOtp", AuthController.resendOtp);

authRoutes.post("/forgetPassword", AuthController.forgetPassword);

authRoutes.post("/verifyForgetPassword", AuthController.verifyForgetPassword);

authRoutes.post("/loginViaNumber", AuthController.loginViaNumber);

authRoutes.post("/resetPassword", checkRoleAuth(), AuthController.resetPassword);

// GOOGLE OAUTH

authRoutes.post("/google", AuthController.googleAuth);

authRoutes.get("/logout", AuthController.logout);

export default authRoutes;
