import { Request, Response } from "express";
import { UserService } from "../services/user.service";

class _UserController {
  async getUser(req: Request, res: Response) {
    const id = res.locals.user.id;
    const found = await UserService.getOneUser({ id });
    return res.status(201).send({ message: "success", user: found });
  }

  async creatorOnboard(req: Request, res: Response) {
    const id = res.locals.user.id;
    const {
      pageName,
      industry,
      gender,
      description,
      youtubeHandle,
      instagramHandle,
      facebookHandle,
      twitterHandle,
    } = req.body;
    const foundUser = await UserService.getOneUser({ id });
    if (!foundUser) return res.status(404).send({ message: "User not found" });
    if (foundUser.role.includes("CREATOR"))
      return res.status(400).send({ message: "Already a creator" });
    const updatedBody = {
      pageName,
      industry,
      gender,
      bio: description,
      youtubeHandle,
      instagramHandle,
      facebookHandle,
      twitterHandle,
      isCreator: true,
      role: ["CREATOR", ...foundUser.role],
    };
    await UserService.updateOneUser({ id }, updatedBody);
    return res.status(201).send({ message: "Success" });
  }
}

export const UserController = new _UserController();
