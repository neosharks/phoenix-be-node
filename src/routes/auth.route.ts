import express from "express";
//----------------------------------
import { AuthController } from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/register", AuthController.register);

authRoutes.post("/login", AuthController.login);

authRoutes.post("/sendOtp", AuthController.sendOtp);

authRoutes.post("/loginViaNumber", AuthController.loginViaNumber);

// GOOGLE OAUTH

authRoutes.post("/google", AuthController.googleAuth);

authRoutes.get("/logout", AuthController.logout);

export default authRoutes;
