import prisma from "../../prisma";
import logger from "../core/logger.core";

class _InsightService {
  async getAllPackagesOfCreator(query: any, skip: any = 0) {
    try {
      return await prisma.patronCreator.findMany({
        where: query,
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
        skip,
        take: 10,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export const InsightService = new _InsightService();
