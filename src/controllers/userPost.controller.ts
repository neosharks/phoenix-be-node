import { Request, Response } from "express";
import Jimp from "jimp";
import { UserPostService } from "../services/userPost.service";
import { UserService } from "../services/user.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import prisma from "../../prisma";
import logger from "../core/logger.core";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { generateFileName, getObjectSignedUrl, uploadFile } from "../core/s3upload.core";

class _UserPostController {
  async getAllUserPostByUser(req: Request, res: Response) {
    try {
      const { author } = req.query;
      if (!author) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const foundUser = await UserService.getOneUser({ username: author });
      if (!foundUser) return res.status(400).send({ message: errorMessage.NOT_FOUND });
      const found = await UserPostService.getAllUserPostByUser({
        authorId: foundUser.id,
        isPrivate: true,
      });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(200).send({ message: "success", data: found });
    } catch (error) {
      logger.error("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
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
      if (returnPosts.length === 0)
        return res.status(200).send({ message: errorMessage.NOT_FOUND });
      returnPosts = returnPosts.sort(function (a: any, b: any) {
        return b.updatedAt - a.updatedAt;
      });
      if (returnPosts.length > 0) {
        returnPosts = await Promise.all(
          returnPosts.map(async (ele: any) => {
            if (ele?.image?.length > 0) {
              const response = await getObjectSignedUrl(ele.image);
              ele.image = response;
            }
            return ele;
          }),
        );
      }
      return res.status(200).send({ message: successMessages.SUCCESS, data: returnPosts });
    } catch (error) {
      logger.error("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getOneUserPost(req: Request, res: Response) {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const found = await UserPostService.getOneUserPost({ id });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(201).send({ message: successMessages.SUCCESS, data: found });
    } catch (error) {
      logger.error("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async likePostToggle(req: any, res: Response) {
    try {
      const { postId } = req.body;
      const { id } = res.locals.user;
      if (!postId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const foundPost = await UserPostService.getOneUserPost({ id: postId });
      if (!foundPost) return res.status(400).send({ message: errorMessage.NOT_FOUND });
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
      res.status(201).send({ message: successMessages.CREATED });
    } catch (error) {
      logger.error("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async update(req: any, res: Response) {
    try {
      const { postId, updates } = req.body;
      if (!postId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const foundPost = await UserPostService.getOneUserPost({ id: postId });
      if (!foundPost) return res.status(400).send({ message: errorMessage.NOT_FOUND });
      await UserPostService.updateOneUserPost({ id: postId }, updates);
      res.status(201).send({ message: successMessages.UPDATED });
    } catch (error) {
      logger.error("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async delete(req: any, res: Response) {
    try {
      const { postId } = req.body;
      if (!postId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const foundPost = await UserPostService.getOneUserPost({ id: postId });
      if (!foundPost) return res.status(400).send({ message: errorMessage.NOT_FOUND });
      await UserPostService.delete(postId);
      res.status(201).send({ message: successMessages.SUCCESS });
    } catch (error) {
      logger.error("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async createOneUserPost(req: any, res: Response) {
    try {
      const { body, title, isPrivate } = req.body;
      const image = req.file;
      const { id } = res.locals.user;
      if (!body || !id) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      let imageName;
      if (image) {
        imageName = generateFileName();
        const jimpImage = await Jimp.read(image.buffer);
        const buffer = await jimpImage.getBufferAsync(image.mimetype);
        await uploadFile(buffer, imageName, image.mimetype);
      }
      const created = await UserPostService.createOneUserPost({
        authorId: id,
        body,
        type: image ? "IMAGE" : "TEXT",
        title,
        image: imageName,
        isPrivate,
      });
      if (created.image) created.image = await getObjectSignedUrl(created.image);
      res.status(201).send({ message: successMessages.CREATED, data: created });
    } catch (error) {
      logger.error("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async commentOnPostByUser(req: any, res: Response) {
    try {
      const { body, authorId, userPostId } = req.body;
      if (!body || !authorId || !userPostId)
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const created = await UserPostService.createOneComment({ body, authorId, userPostId });
      res.status(201).send({ message: successMessages.SUCCESS, data: created });
    } catch (error) {
      logger.error("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const UserPostController = new _UserPostController();
