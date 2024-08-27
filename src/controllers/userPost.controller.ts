import { Request, Response } from "express";
import { UserPostService } from "../services/userPost.service";
import { UserService } from "../services/user.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { generateRandomAlpaNumberic } from "../lib/helper.lib";
import { userPostSchema } from "../validators/userPost.validator";
import { NotificationService } from "../services/notification.service";
import UserPost from "../models/userPost.model";
import User from "../models/user.model";
import { sequelize } from "../models/sequelize";
import Poll from "../models/poll.model";

class _UserPostController {
  async getAllUserPostByUser(req: Request, res: Response) {
    try {
      const { author } = req.query;
      const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
      const take = Number(req.query.per_page) || 10;
      if (!author)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });

      const foundUser = await UserService.getOneUser({ username: author });
      if (!foundUser)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });

      let returnPosts = await UserPostService.getAllUserPostByUser(
        { authorId: foundUser.id },
        skip,
        take,
      );

      if (!returnPosts) return res.status(404).send({ message: errorMessage.NOT_FOUND });
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
      const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
      const take = Number(req.query.per_page) || 10;
      const foundPatronCreator = await PatronCreatorService.getAll({ patronId: id }, skip, take);

      for (let i = 0; i < foundPatronCreator.length; i++) {
        const ele = foundPatronCreator[i];
        const allPostsByUser = await UserPostService.getAllUserPostByUser(
          { authorId: ele.creatorId },
          skip,
          take,
        );
        returnPosts = [...returnPosts, ...allPostsByUser];
      }
      const allUserPosts = await UserPostService.getAllUserPostByUser({ authorId: id }, skip, take);
      returnPosts = [...returnPosts, ...allUserPosts];

      // Remove duplicate posts
      const seenPostIds = new Set();
      returnPosts = returnPosts.filter((post: any) => {
        if (seenPostIds.has(post.id)) {
          return false;
        } else {
          seenPostIds.add(post.id);
          return true;
        }
      });

      if (returnPosts.length === 0)
        return res.status(200).send({ message: errorMessage.NOT_FOUND });

      returnPosts = returnPosts.sort((a: any, b: any) => b.updatedAt - a.updatedAt);
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

      const postId = parseInt(id as string, 10);
      const found = await UserPostService.getOneUserPost({ id: postId });
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

      const validation = userPostSchema.validate(req.body);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }

      if (!postId) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      }

      const foundPost = await UserPost.findOne({
        where: { id: postId },
        include: [
          { model: User, as: "likedBy" },
          { model: User, as: "author" },
        ],
      });

      if (!foundPost) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      }

      const userIndex = foundPost.likedBy.findIndex((user: any) => user.id === id);
      if (userIndex === -1) {
        await UserPost.update(
          { likedBy: sequelize.literal(`array_append(likedBy, ${id})`) },
          { where: { id: postId } },
        );

        await NotificationService.createOneNotification({
          aboutUserId: id,
          notifiedUserId: foundPost.authorId,
          message: ` have liked on your post`,
          link: postId.toString(),
          type: "NEW_LIKE",
        });
      } else {
        await UserPost.update(
          { likedBy: sequelize.literal(`array_remove(likedBy, ${id})`) },
          { where: { id: postId } },
        );
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
      const validation = userPostSchema.validate(req.body);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      if (!pollId || !selectedId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });

      const foundPoll = await Poll.findOne({ where: { id: pollId } });
      if (!foundPoll)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });

      const userIndex = foundPoll.selectedOptions.findIndex((user: any) => user.userId === id);
      if (userIndex === -1) {
        await Poll.update(
          {
            selectedOptions: sequelize.literal(
              `array_append(selectedOptions, {userId: ${id}, selectedId: ${selectedId}})`,
            ),
          },
          { where: { id: pollId } },
        );
      } else {
        foundPoll.selectedOptions[userIndex].selectedId = selectedId;
        await Poll.update(
          { selectedOptions: foundPoll.selectedOptions },
          { where: { id: pollId } },
        );
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
      const validation = userPostSchema.validate(req.body);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
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

  async createOneUserPost(req: Request, res: Response) {
    try {
      const body = req.body;
      const { description, type, visibility, videoUrl, document, image, title, packages } = body;
      const { id } = res.locals.user;
      const payload: any = { authorId: id };

      if (
        !description ||
        !id ||
        !type ||
        !visibility ||
        (type === "IMAGE" && !image) ||
        (type === "VIDEO" && !videoUrl) ||
        (type === "DOCUMENT" && !document)
      )
        return res.status(400).send({ message: "Missing parameters" });

      if (visibility === "PAID_MEMBER" && (!packages || packages.length === 0))
        return res.status(400).send({ message: "Missing parameters" });

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

      const created = await UserPostService.createOneUserPost({
        ...payload,
        description,
        type,
        visibility,
        image,
        videoUrl,
        document,
        title,
        packages: visibility === "PAID_MEMBER" ? packages : [],
      });
      return res.status(201).send({ message: "Created successfully", data: created });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error });
    }
  }

  async commentOnPostByUser(req: Request, res: Response) {
    try {
      const { description, authorId, userPostId } = req.body;
      const { id } = res.locals.user;
      if (!description || !authorId || !userPostId)
        return res.status(400).send({ message: "Missing parameters" });

      const created: any = await UserPostService.createOneComment({
        description,
        authorId,
        userPostId,
      });
      await NotificationService.createOneNotification({
        aboutUserId: id,
        notifiedUserId: authorId,
        message: `${created.firstName} ${created.lastName} commented on your post`,
        link: String(userPostId),
        type: "NEW_COMMENT",
      });
      res.status(201).send({ message: "Comment added successfully", data: created });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { postId } = req.body;
      const { id } = res.locals.user;
      if (!postId) return res.status(400).send({ message: "Missing parameters" });

      const foundPost = await UserPostService.getOneUserPost({ id: postId });
      if (!foundPost) return res.status(404).send({ message: "Post not found" });

      if (id !== foundPost.authorId) {
        return res.status(403).send({ message: "Not allowed" });
      }
      await UserPostService.delete(postId);
      res.status(200).send({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error });
    }
  }
}

export const UserPostController = new _UserPostController();
