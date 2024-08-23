import prisma from "../../prisma";
import UserPost from "../models/userPost.model";
import PostComment from "../models/postComment.model";
import Poll from "../models/poll.model";
import User from "../models/user.model";

class _UserPostService {
  async getAllUserPostByUser(query: any, skip: number = 0, take: number = 10) {
    try {
      return await UserPost.findAll({
        where: query,
        include: [
          "poll",
          "packages",
          "class",
          {
            model: "PostComment",
            attributes: ["description", "createdAt", "updatedAt"],
            include: [
              {
                model: User,
                attributes: [
                  "id",
                  "firstName",
                  "lastName",
                  "profileImage",
                  "email",
                  "username",
                  "role",
                ],
              },
            ],
          },
          {
            model: User,
            as: "likedBy",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "role",
            ],
          },
          {
            model: User,
            as: "author",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "role",
            ],
          },
        ],
        offset: skip,
        limit: take,
      });
    } catch (error) {
      throw error;
    }
  }

  async getOneUserPost(query: any) {
    try {
      return await UserPost.findOne({
        where: query,
        include: [
          {
            model: "PostComment",
            include: [{ model: User }],
          },
          { model: User, as: "author" },
          {
            model: "User",
            as: "likedBy",
            attributes: ["id", "firstName", "lastName", "profileImage", "email", "username"],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  async updateOneUserPost(query: any, data: any) {
    try {
      return await UserPost.update(data, { where: query });
    } catch (error) {
      throw error;
    }
  }

  async createOneUserPost(dataValues: any) {
    try {
      const {
        description,
        authorId,
        title,
        type,
        image,
        visibility,
        allowComments,
        videoUrl,
        document,
        pollId,
        packages,
      } = dataValues;
      return await UserPost.create({
        description,
        authorId,
        title,
        type,
        image,
        visibility,
        allowComments,
        videoUrl,
        document,
        pollId,
        packages: { connect: packages.map((id: any) => ({ id })) },
        include: [
          "likedBy",
          "comments",
          {
            model: User,
            as: "author",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "role",
            ],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  async createOneComment(dataValues: any) {
    const { description, authorId, userPostId } = dataValues;
    try {
      return await PostComment.create({
        description,
        authorId,
        userPostId,
        include: [
          {
            model: User,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "role",
            ],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  async createPoll(data: any) {
    try {
      return await Poll.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async getOnePoll(query: any) {
    try {
      return await Poll.findOne({
        where: query,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateOnePoll(query: any, data: any) {
    try {
      return await Poll.update(data, { where: query });
    } catch (error) {
      throw error;
    }
  }

  async delete(postId: any) {
    try {
      await PostComment.destroy({ where: { userPostId: postId } });
      return await UserPost.destroy({ where: { id: postId } });
    } catch (error) {
      throw error;
    }
  }
}
export const UserPostService = new _UserPostService();
