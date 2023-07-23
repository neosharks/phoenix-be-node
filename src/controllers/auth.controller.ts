import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import Logger from "../core/Logger";

class _AuthController {
  async register(req: Request, res: Response) {
    const body = req.body;
    const foundUser = await AuthService.getOneUser({ email: body.email });
    Logger.info("user", foundUser);
    if (foundUser) return res.status(403).json({ message: "email already exists" });
    body.username = body.email.split("@")[0];
    await AuthService.createOneUser(body);
    return res.status(201).json({ messge: "Registered" });
  }
}

export const AuthController = new _AuthController();
