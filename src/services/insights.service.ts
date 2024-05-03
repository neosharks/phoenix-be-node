import prisma from "../../prisma";
import logger from "../core/logger.core";

class _InsightService {
  async getAllPackagesOfCreator(query: any, skip: number, take: number) {
    try {
      return await prisma.patronCreator.findMany({
        where: query,
        skip: skip,
        take: take,
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export const InsightService = new _InsightService();
