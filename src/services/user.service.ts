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

  async getAllUserByParams(query: any, skip: number = 0, take: number = 10) {
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
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllUser(skip: number = 0, take: number = 10) {
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
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllTotalUser() {
    try {
      return await prisma.user.findMany();
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

  async deleteAccount(id: number, updatedEmail: string) {
    try {
      const deletedUser = await prisma.user.update({
        where: { id },
        data: {
          email: updatedEmail,
          status: "DELETED",
        },
      });
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
}

export const UserService = new _UserService();
