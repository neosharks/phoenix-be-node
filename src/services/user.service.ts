import prisma from "../../prisma";

class _UserService {
  async getOneUser(query: any) {
    try {
      return await prisma.user.findUnique({ where: query });
    } catch (error) {
      throw error;
    }
  }

  async getAllLinks(query: any) {
    try {
      return await prisma.allLinks.findMany({
        where: query,
      });
    } catch (error) {
      throw error;
    }
  }

  async createLink(data: any) {
    try {
      return await prisma.allLinks.create({
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllUserByParams(query: any) {
    try {
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
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllUser() {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async createOneUser(data: any) {
    try {
      return await prisma.user.create({ data: data });
    } catch (error) {
      throw error;
    }
  }

  async updateOneUser(query: any, data: any) {
    try {
      return await prisma.user.update({ where: query, data: data });
    } catch (error) {
      throw error;
    }
  }

  async deleteOneUser(id: any) {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}

export const UserService = new _UserService();
