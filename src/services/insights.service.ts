import prisma from "../../prisma";
import logger from "../core/logger.core";

class _InsightService {
  async getAllPackagesOfCreator(query: any, skip: number = 0, take: number = 10) {
    try {
      return await prisma.patronCreator.findMany({
        where: query,
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
        skip,
        take,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const InsightService = new _InsightService();
