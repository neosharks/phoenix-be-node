import prisma from "../../prisma";

class _UserPostService {
  async getAllUserPostByUser(query: any) {
    return await prisma.userPost.findMany({ where: query });
  }

  async getOneUserPost(query: any) {
    return await prisma.userPost.findUnique({ where: query });
  }

  async createOneUserPost(dataValues: any) {
    const { body, authorId, title, type, image } = dataValues;
    return await prisma.userPost.create({
      data: { body, authorId, title, type, image },
    });
  }
}

export const UserPostService = new _UserPostService();
