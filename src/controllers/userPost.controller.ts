const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

import { Request, Response } from "express";
import { UserPostService } from "../services/userPost.service";

class _UserPostController {
  async getAllUserPostByUser(req: Request, res: Response) {
    const { authorId } = req.query;
    if (!authorId) return res.status(400).send({ message: "provide authorId" });
    const found = await UserPostService.getAllUserPostByUser({
      authorId,
    });
    if (!found) return res.status(404).send({ message: "user post cannot be found" });
    return res.status(200).send({ message: "success", data: found });
  }

  async getOneUserPost(req: Request, res: Response) {
    const { id } = req.query;
    if (!id) return res.status(400).send({ message: "provide id" });
    const found = await UserPostService.getOneUserPost({ id });
    if (!found) return res.status(404).send({ message: "User Post not found" });

    return res.status(201).send({ message: "success", data: found });
  }

  async createOneUserPost(req: any, res: Response) {
    const { body, authorId } = req.body;
    const UploadFile = req.file;
    console.log(UploadFile);
    if (!body || !authorId) return res.status(400).send({ message: "Incomplete params" });
    let uploadUrl = undefined;

    await UserPostService.createOneUserPost({ ...req.body, image: uploadUrl });
    res.status(201).send({ message: "created" });
  }
}

export const UserPostController = new _UserPostController();
