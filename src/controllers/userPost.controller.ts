import { Request, Response } from "express";
import { UserPostService } from "../services/userPost.service";
import { UserService } from "../services/user.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import prisma from "../../prisma";

class _UserPostController {
  async getAllUserPostByUser(req: Request, res: Response) {
    const { author } = req.query;
    if (!author) return res.status(400).send({ message: "provide author" });
    const foundUser = await UserService.getOneUser({ username: author });
    if (!foundUser) return res.status(400).send({ message: "provide author" });
    const found = await UserPostService.getAllUserPostByUser({ authorId: foundUser.id });
    if (!found) return res.status(404).send({ message: "user post cannot be found" });
    return res.status(200).send({ message: "success", data: found });
  }

  async getAllPostForUser(req: Request, res: Response) {
    const { id } = res.locals.user;
    const foundPatronCreator = await PatronCreatorService.getAll({ patronId: id });
    if (!foundPatronCreator) return res.status(404).send({ message: "" });
    const found = await UserPostService.getAllUserPostByUser({ authorId: id });
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

  async likePostToggle(req: any, res: Response) {
    const { postId } = req.body;
    const { id } = res.locals.user;
    if (!postId) return res.status(400).send({ message: "Incomplete params" });
    const foundPost = await UserPostService.getOneUserPost({ id: postId });
    if (!foundPost) return res.status(400).send({ message: "Post Not found" });
    const userIndex = foundPost.likedBy.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      await prisma.userPost.update({
        where: { id: postId },
        data: { likedBy: { connect: { id: id } } },
      });
    } else {
      await prisma.userPost.update({
        where: { id: postId },
        data: { likedBy: { disconnect: { id: id } } },
      });
    }
    res.status(201).send({ message: "created" });
  }

  async createOneUserPost(req: any, res: Response) {
    const { body, authorId } = req.body;
    if (!body || !authorId) return res.status(400).send({ message: "Incomplete params" });
    await UserPostService.createOneUserPost({ ...req.body });
    res.status(201).send({ message: "created" });
  }

  async commentOnPostByUser(req: any, res: Response) {
    const { body, authorId, userPostId } = req.body;
    if (!body || !authorId || !userPostId)
      return res.status(400).send({ message: "Incomplete params" });
    await UserPostService.createOneComment({ body, authorId, userPostId });
    res.status(201).send({ message: "created" });
  }
}

export const UserPostController = new _UserPostController();
