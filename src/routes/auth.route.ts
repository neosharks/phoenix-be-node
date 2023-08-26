import express from "express";
import passport from "passport";
//----------------------------------
import { AuthController } from "../controllers/auth.controller";
//----------------------------------
import config from "../../config";
import logger from "../core/logger.core";
import { signJwt } from "../core/jwt.core";

const authRoutes = express.Router();

authRoutes.post("/register", AuthController.register);

authRoutes.post("/login", AuthController.login);

authRoutes.post("/sendOtp", AuthController.sendOtp);

authRoutes.post("/loginViaNumber", AuthController.loginViaNumber);

// GOOGLE OAUTH

authRoutes.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${config.main.feUrl}/auth/jwt/login`,
    session: false,
  }),
  async function (req: any, res: any) {
    const token = await signJwt(req.user);
    res.redirect(`${config.main.feUrl}/dashboard`, token);
  },
);

export default authRoutes;
