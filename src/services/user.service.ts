import prisma from "../../prisma";

class _UserService {
  async getOneUser(query: any) {
    return await prisma.user.findUnique({ where: query });
  }

  async getAllUserByParams(query: any, skip?: any, take?: any) {
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
        industry: true,
        coverImage: true,
      },
      skip,
      take,
    });
  }

  async getAllUser(skip?: any, take?: any) {
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
      skip,
      take,
    });
  }

  async createOneUser(data: any) {
    return await prisma.user.create({ data: data });
  }

  async updateOneUser(query: any, data: any) {
    return await prisma.user.update({ where: query, data: data });
  }

  async deleteOneUser(id: string) {
    return await prisma.user.delete({ where: { id } });
  }
}

export const UserService = new _UserService();
