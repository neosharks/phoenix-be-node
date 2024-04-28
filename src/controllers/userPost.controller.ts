import { Request, Response } from "express";
import { UserPostService } from "../services/userPost.service";
import { UserService } from "../services/user.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import prisma from "../../prisma";
import logger from "../core/logger.core";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { GetUploadedFile, getObjectSignedUrl } from "../core/s3upload.core";
import { getBlurredImage } from "../lib/image.lib";
import { generateRandomAlpaNumberic } from "../lib/helper.lib";

class _UserPostController {
  async getAllUserPostByUser(req: Request, res: Response) {
    try {
      const { author } = req.query;
      if (!author)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundUser = await UserService.getOneUser({ username: author });
      if (!foundUser)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      let returnPosts = await UserPostService.getAllUserPostByUser({
        authorId: foundUser.id,
      });

      if (!returnPosts) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      if (returnPosts.length > 0) {
        returnPosts = await Promise.all(
          returnPosts.map(async (ele: any) => {
            if (ele?.image?.length > 0) {
              if (ele.visibility !== "PAID_MEMBER") ele.image = await getObjectSignedUrl(ele.image);
              else ele.image = await getBlurredImage(ele.image);
            }
            return ele;
          }),
        );
      }
      return res.status(200).send({ message: successMessages.SUCCESS, data: returnPosts });
    } catch (error) {
      console.log("Error: ", error);
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
              if (!ele.isPrivate) ele.image = await getObjectSignedUrl(ele.image);
              else ele.image = await getBlurredImage(ele.image);
            }
            return ele;
          }),
        );
      }
      return res.status(200).send({ message: successMessages.SUCCESS, data: returnPosts });
    } catch (error) {
      console.log("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getSingleUserPost(req: Request, res: Response) {
    try {
      const { id } = req.query;
      if (!id) return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const found = await UserPostService.getOneUserPost({ id });
      // if (found?.isPrivate && found?.image) found.image = await getBlurredImage(found.image);
      if (found?.image) found.image = await await getObjectSignedUrl(found.image);
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(201).send({ message: successMessages.SUCCESS, data: found });
    } catch (error) {
      console.log("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async likePostToggle(req: any, res: Response) {
    try {
      const { postId } = req.body;
      const { id } = res.locals.user;
      if (!postId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundPost = await UserPostService.getOneUserPost({ id: postId });
      if (!foundPost)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
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
      console.log("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async voteOnPoll(req: any, res: Response) {
    try {
      const { pollId, selectedId } = req.body;
      const { id } = res.locals.user;
      if (!pollId || !selectedId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundPoll: any = await UserPostService.getOnePoll({ id: pollId });
      if (!foundPoll)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      const userIndex = foundPoll.selectedOptions.findIndex((user: any) => user.userId === id);
      if (userIndex === -1) {
        await prisma.poll.update({
          where: { id: pollId },
          data: { selectedOptions: [...foundPoll.selectedOptions, { userId: id, selectedId }] },
        });
      } else {
        foundPoll.selectedOptions[userIndex].selectedId = selectedId;
        await prisma.poll.update({
          where: { id: pollId },
          data: { selectedOptions: [...foundPoll.selectedOptions] },
        });
      }
      res.status(201).send({ message: successMessages.CREATED });
    } catch (error) {
      console.log("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async update(req: any, res: Response) {
    try {
      const { postId, updates } = req.body;
      if (!postId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundPost = await UserPostService.getOneUserPost({ id: postId });
      if (!foundPost)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      await UserPostService.updateOneUserPost({ id: postId }, updates);
      res.status(201).send({ message: successMessages.UPDATED });
    } catch (error) {
      console.log("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async createOneUserPost(req: any, res: Response) {
    try {
      const body = req.body;
      const { description, type, visibility, videoUrl, title, packages } = body;
      const image = req.file;

      const { id } = res.locals.user;
      const payload: any = { authorId: id };

      if (
        !description ||
        !id ||
        !type ||
        !visibility ||
        (type === "IMAGE" && !image) ||
        (type === "VIDEO" && !videoUrl)
      )
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });

      if (visibility === "PAID_MEMBER" && (!packages || packages.length === 0))
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });

      if (type === "POLL") {
        const { options } = req.body;
        let redefinedOptions = options.map((ele: string) => {
          return { id: generateRandomAlpaNumberic(5), optionText: ele };
        });
        const response = await UserPostService.createPoll({
          options: redefinedOptions,
          selectedOptions: [],
          authorId: id,
          description,
          title,
        });
        payload.pollId = response.id;
      }

      if (type === "IMAGE" && image) if (image) payload.image = await GetUploadedFile(image);

      const created = await UserPostService.createOneUserPost({
        ...payload,
        description,
        type,
        visibility,
        videoUrl,
        title,
        packages: visibility === "PAID_MEMBER" ? packages : [],
      });

      if (created.image) created.image = await getObjectSignedUrl(created.image);

      return res.status(201).send({ message: successMessages.CREATED, data: created });
    } catch (error) {
      console.log(error);
      console.log("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async commentOnPostByUser(req: any, res: Response) {
    try {
      const { description, authorId, userPostId } = req.body;
      if (!description || !authorId || !userPostId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const created = await UserPostService.createOneComment({ description, authorId, userPostId });

      res.status(201).send({ message: successMessages.SUCCESS, data: created });
    } catch (error) {
      console.log("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async delete(req: any, res: Response) {
    try {
      const { postId } = req.body;
      const { id } = res.locals.user;
      if (!postId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundPost = await UserPostService.getOneUserPost({ id: postId });
      if (!foundPost)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      if(    id !== foundPost.authorId){
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_ALLOWED });
      }
      await UserPostService.delete(postId);
      res.status(201).send({ message: successMessages.SUCCESS });
    } catch (error) {
      console.log("Error: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const UserPostController = new _UserPostController();
