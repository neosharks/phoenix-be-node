import prisma from "../../prisma";

class _UserPostService {
  async getAllUserPostByUser(query: any, skip?: any, take?: any) {
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
      skip: skip,
      take: take,
    });
  }

  async getOneUserPost(query: any) {
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
  }

  async updateOneUserPost(query: any, data: any) {
    return await prisma.userPost.update({ where: query, data: data });
  }

  async createOneUserPost(dataValues: any) {
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
    const packagesToConnect = Array.isArray(packages) ? packages.map((id: string) => ({ id })) : [];

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
  }

  async createOneComment(dataValues: any) {
    const { description, authorId, userPostId } = dataValues;
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
  }

  async createPoll(data: any) {
    return await prisma.poll.create({ data });
  }

  async getOnePoll(query: any) {
    return await prisma.poll.findUnique({
      where: query,
    });
  }

  async updateOnePoll(query: any, data: any) {
    return await prisma.poll.update({ where: query, data: data });
  }

  async delete(postId: string) {
    await prisma.postComment.deleteMany({ where: { userPostId: postId } });
    return await prisma.userPost.delete({ where: { id: postId } });
  }
}

export const UserPostService = new _UserPostService();
