import prisma from "../../prisma";

class _AuthService {
  async getOneUser(query: any) {
    return await prisma.user.findUnique({ where: query });
  }

  async createOneUser(data: any) {
    return await prisma.user.create({ data: data });
  }
}

export const AuthService = new _AuthService();
