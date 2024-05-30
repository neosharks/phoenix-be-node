import prisma from "../../prisma";

class _UserPostService {
  async getAllUserPostByUser(query: any, skip: number = 0, take: number = 10) {
    try {
      return await prisma.userPost.findMany({
        where: query,
        include: {
          poll: true,
          packages: true,
          comments: {
            select: {
              description: true,
              createdAt: true,
              updatedAt: true,
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profileImage: true,
                  email: true,
                  username: true,
                  role: true,
                },
              },
            },
          },
          likedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              role: true,
            },
          },
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              role: true,
            },
          },
        },
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }
  }

  async getOneUserPost(query: any) {
    try {
      return await prisma.userPost.findUnique({
        where: query,
        include: {
          comments: {
            include: {
              author: true,
            },
          },
          author: true,
          likedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateOneUserPost(query: any, data: any) {
    try {
      return await prisma.userPost.update({ where: query, data: data });
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
        pollId,
        packages,
      } = dataValues;
      const packagesToConnect = Array.isArray(packages) ? packages.map((id: any) => ({ id })) : [];

      return await prisma.userPost.create({
        data: {
          description,
          authorId,
          title,
          type,
          image,
          visibility,
          allowComments,
          videoUrl,
          pollId,
          packages: { connect: packagesToConnect },
        },
        include: {
          likedBy: true,
          comments: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async createOneComment(dataValues: any) {
    const { description, authorId, userPostId } = dataValues;
    try {
      return await prisma.postComment.create({
        data: { description, authorId, userPostId },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async createPoll(data: any) {
    try {
      return await prisma.poll.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async getOnePoll(query: any) {
    try {
      return await prisma.poll.findUnique({
        where: query,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateOnePoll(query: any, data: any) {
    try {
      return await prisma.poll.update({ where: query, data: data });
    } catch (error) {
      throw error;
    }
  }

  async delete(postId: any) {
    try {
      await prisma.postComment.deleteMany({ where: { userPostId: postId } });
      return await prisma.userPost.delete({ where: { id: postId } });
    } catch (error) {
      throw error;
    }
  }
}

export const UserPostService = new _UserPostService();
