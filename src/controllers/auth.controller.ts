import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserService } from "../services/user.service";
import { signJwt } from "../core/jwt.core";

class _AuthController {
  async register(req: Request, res: Response) {
    const body = req.body;
    const foundUser = await UserService.getOneUser({ email: body.email });
    if (foundUser) return res.status(403).json({ message: "Email already exists" });

    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(body.password, salt);

    body.password = hash;
    body.username = body.email.split("@")[0];
    const randomNum = (Math.random() * 25) | 1;
    const profileImage = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${randomNum}.jpg`;
    const created = await UserService.createOneUser({ ...body, profileImage });
    const accessToken = await signJwt(created);
    return res.status(201).json({ messge: "success", accessToken, user: created });
  }

  async login(req: Request, res: Response) {
    const body = req.body;
    const foundUser = await UserService.getOneUser({ email: body.email });
    if (!foundUser) return res.status(403).json({ message: "User is not registered" });
    const isMatch = await bcrypt.compareSync(body.password, foundUser.password);
    if (!isMatch) return res.status(403).json({ message: "Wrong Password" });
    const accessToken = await signJwt(foundUser);
    return res.status(201).json({ messge: "success", accessToken, user: foundUser });
  }
}

export const AuthController = new _AuthController();
