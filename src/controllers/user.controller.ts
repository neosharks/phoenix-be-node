import { Request, Response } from "express";
import { UserService } from "../services/user.service";

class _UserController {
  async getUser(req: Request, res: Response) {
    const id = res.locals.user.id;
    const found = await UserService.getOneUser({ id });
    return res.status(201).send({ message: "success", user: found });
  }

  async getUserByUsername(req: Request, res: Response) {
    const { username } = req.params;
    if (!username) return res.status(400).send({ message: "provide username" });
    const found = await UserService.getOneUser({ username });
    if (!found) return res.status(404).send({ message: "user cannot be found" });
    return res.status(200).send({ message: "success", user: found });
  }

  async getAllCreator(req: Request, res: Response) {
    const found = await UserService.getAllUserByParams({ isCreator: true });
    if (!found) return res.status(404).send({ message: "user cannot be found" });
    return res.status(200).send({ message: "success", data: found });
  }

  async update(req: Request, res: Response) {
    const update = req.body;
    await UserService.updateOneUser({ id: res.locals.user.id }, update);
    return res.status(200).send({ message: "updated" });
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
