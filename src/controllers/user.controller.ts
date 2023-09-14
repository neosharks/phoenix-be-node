import { Request, Response } from "express";
import { UserService } from "../services/user.service";

class _UserController {
  async getUser(req: Request, res: Response) {
    const id = res.locals.user.id;
    const found = await UserService.getOneUser({ id });
    res.status(201).send({ message: "success", user: found });
  }
}

export const UserController = new _UserController();
