import prisma from "../../prisma";

class _UserService {
  // REMOVE PASSWORD FROM ALL API

  async getOneUser(query: any) {
    return await prisma.user.findUnique({ where: query });
  }

  async getAllUserByParams(query: any) {
    return await prisma.user.findMany({
      where: query,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        email: true,
        username: true,
        role: true,
      },
    });
  }

  async getAllUser() {
    return await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        email: true,
        username: true,
        phoneNumber: true,
        role: true,
      },
    });
  }

  async createOneUser(data: any) {
    return await prisma.user.create({ data: data });
  }

  async updateOneUser(query: any, data: any) {
    return await prisma.user.update({ where: query, data: data });
  }
}

export const UserService = new _UserService();
