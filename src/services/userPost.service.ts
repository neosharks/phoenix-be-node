import prisma from "../../prisma";

class _UserPostService {
  async getAllUserPostByUser(query: any) {
    return await prisma.userPost.findMany({
      where: query,
      include: {
        comments: {
          select: {
            body: true,
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
    const { body, authorId, title, type, image, isPrivate } = dataValues;
    return await prisma.userPost.create({
      data: { body, authorId, title, type, image, isPrivate },
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
    const { body, authorId, userPostId } = dataValues;
    return await prisma.postComment.create({
      data: { body, authorId, userPostId },
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

  async delete(postId: string) {
    await prisma.postComment.deleteMany({ where: { userPostId: postId } });

    return await prisma.userPost.delete({ where: { id: postId } });
  }
}

export const UserPostService = new _UserPostService();
