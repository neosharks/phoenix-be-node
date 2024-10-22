import prisma from "../../prisma";
import { userCommonObject } from "../lib/commonObjects.lib";
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

  async getAll(query: any, skip: number = 0, take: number = 10) {
    try {
      return await prisma.patronCreator.findMany({
        where: query,
        include: {
          package: true,
          creator: {
            select: userCommonObject,
          },
          patron: {
            select: userCommonObject,
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
