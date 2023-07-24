import prisma from "../../prisma";

class _UserService {
  async getOneUser(query: any) {
    return await prisma.user.findUnique({ where: query });
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
        role: true,
      },
    });
  }

  async createOneUser(data: any) {
    return await prisma.user.create({ data: data });
  }
}

export const UserService = new _UserService();
