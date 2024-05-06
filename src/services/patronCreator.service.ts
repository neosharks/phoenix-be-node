import { skip } from "node:test";
import prisma from "../../prisma";

class _PatronCreatorService {
  async getFirst(query: any) {
    try {
      return await prisma.patronCreator.findFirst({ where: query });
    } catch (error) {
      throw error;
    }
  }

  async getOne(query: any) {
    try {
      return await prisma.patronCreator.findUnique({ where: query });
    } catch (error) {
      throw error;
    }
  }

  async getAll(query: any, skip?: any, take?: any) {
    try {
      return await prisma.patronCreator.findMany({
        where: query,
        include: {
          package: true,
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              industry: true,
            },
          },
          patron: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              industry: true,
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
}

export const PatronCreatorService = new _PatronCreatorService();
