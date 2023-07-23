import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AuthService } from "../services/auth.service";
import { signJwt } from "../core/jwt.core";

class _AuthController {
  async register(req: Request, res: Response) {
    const body = req.body;
    const foundUser = await AuthService.getOneUser({ email: body.email });
    if (foundUser) return res.status(403).json({ message: "email already exists" });

    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(body.password, salt);

    body.password = hash;
    body.username = body.email.split("@")[0];
    const created = await AuthService.createOneUser(body);
    const accessToken = await signJwt(created);
    return res.status(201).json({ messge: "success", accessToken, user: created });
  }

  async login(req: Request, res: Response) {
    const body = req.body;
    const foundUser = await AuthService.getOneUser({ email: body.email });
    if (!foundUser) return res.status(403).json({ message: "register first" });
    const isMatch = await bcrypt.compareSync(body.password, foundUser.password);
    if (!isMatch) return res.status(403).json({ message: "Wrong Password" });
    const accessToken = await signJwt(foundUser);
    return res.status(201).json({ messge: "success", accessToken, user: foundUser });
  }
}

export const AuthController = new _AuthController();
