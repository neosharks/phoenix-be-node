import { Request, Response } from "express";
import { UserPostService } from "../services/userPost.service";
import { UserService } from "../services/user.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import prisma from "../../prisma";
import logger from "../core/logger.core";

class _UserPostController {
  async getAllUserPostByUser(req: Request, res: Response) {
    try {
      const { author } = req.query;
      if (!author) return res.status(400).send({ message: "provide author" });
      const foundUser = await UserService.getOneUser({ username: author });
      if (!foundUser) return res.status(400).send({ message: "provide author" });
      const found = await UserPostService.getAllUserPostByUser({ authorId: foundUser.id });
      if (!found) return res.status(404).send({ message: "user post cannot be found" });
      return res.status(200).send({ message: "success", data: found });
    } catch (error) {
      logger.error("Error: ", error);
      return res.status(500).send({ message: "internal server error" });
    }
  }

  async getAllPostForUser(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      let returnPosts: any = [];
      const foundPatronCreator = await PatronCreatorService.getAll({ patronId: id });

      for (let i = 0; i < foundPatronCreator.length; i++) {
        const ele = foundPatronCreator[i];
        const allPostsByUser = await UserPostService.getAllUserPostByUser({
          authorId: ele.creatorId,
        });
        returnPosts = [...returnPosts, ...allPostsByUser];
      }

      const allUserPosts = await UserPostService.getAllUserPostByUser({ authorId: id });
      returnPosts = [...returnPosts, ...allUserPosts];
      if (returnPosts.length === 0) return res.status(200).send({ message: "No Posts found" });
      returnPosts = returnPosts.sort(function (a: any, b: any) {
        return b.updatedAt - a.updatedAt;
      });
      return res.status(200).send({ message: "success", data: returnPosts });
    } catch (error) {
      logger.error("Error: ", error);
      return res.status(500).send({ message: "internal server error" });
    }
  }

  async getOneUserPost(req: Request, res: Response) {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).send({ message: "provide id" });
      const found = await UserPostService.getOneUserPost({ id });
      if (!found) return res.status(404).send({ message: "User Post not found" });
      return res.status(201).send({ message: "success", data: found });
    } catch (error) {
      logger.error("Error: ", error);
      return res.status(500).send({ message: "internal server error" });
    }
  }

  async likePostToggle(req: any, res: Response) {
    try {
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
    } catch (error) {
      logger.error("Error: ", error);
      return res.status(500).send({ message: "internal server error" });
    }
  }

  async update(req: any, res: Response) {
    try {
      const { postId, updates } = req.body;
      if (!postId) return res.status(400).send({ message: "Incomplete params" });
      const foundPost = await UserPostService.getOneUserPost({ id: postId });
      if (!foundPost) return res.status(400).send({ message: "Post Not found" });
      await UserPostService.updateOneUserPost({ id: postId }, updates);
      res.status(201).send({ message: "updated" });
    } catch (error) {
      logger.error("Error: ", error);
      return res.status(500).send({ message: "internal server error" });
    }
  }

  async delete(req: any, res: Response) {
    try {
      const { postId } = req.body;
      if (!postId) return res.status(400).send({ message: "Incomplete params" });
      const foundPost = await UserPostService.getOneUserPost({ id: postId });
      if (!foundPost) return res.status(400).send({ message: "Post Not found" });
      await UserPostService.delete(postId);
      res.status(201).send({ message: "deleted" });
    } catch (error) {
      logger.error("Error: ", error);
      return res.status(500).send({ message: "internal server error" });
    }
  }

  async createOneUserPost(req: any, res: Response) {
    try {
      const { body, title, image } = req.body;
      const { id } = res.locals.user;
      if (!body || !id) return res.status(400).send({ message: "Incomplete params" });
      const created = await UserPostService.createOneUserPost({
        authorId: id,
        body,
        type: "TEXT",
        title,
        image,
      });
      res.status(201).send({ message: "created", data: created });
    } catch (error) {
      logger.error("Error: ", error);
      return res.status(500).send({ message: "internal server error" });
    }
  }

  async commentOnPostByUser(req: any, res: Response) {
    try {
      const { body, authorId, userPostId } = req.body;
      if (!body || !authorId || !userPostId)
        return res.status(400).send({ message: "Incomplete params" });
      const created = await UserPostService.createOneComment({ body, authorId, userPostId });
      res.status(201).send({ message: "success", data: created });
    } catch (error) {
      logger.error("Error: ", error);
      return res.status(500).send({ message: "internal server error" });
    }
  }
}

export const UserPostController = new _UserPostController();
