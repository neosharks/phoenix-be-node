"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//----------------------------------
const auth_controller_1 = require("../controllers/auth.controller");
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const authRoutes = express_1.default.Router();
authRoutes.post("/register", auth_controller_1.AuthController.register);
authRoutes.post("/login", auth_controller_1.AuthController.login);
authRoutes.post("/sendOtp", auth_controller_1.AuthController.sendOtp);
authRoutes.post("/loginViaNumber", auth_controller_1.AuthController.loginViaNumber);
authRoutes.post("/resetPassword", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), auth_controller_1.AuthController.resetPassword);
// GOOGLE OAUTH
authRoutes.post("/google", auth_controller_1.AuthController.googleAuth);
authRoutes.get("/logout", auth_controller_1.AuthController.logout);
exports.default = authRoutes;
