import prisma from "../../prisma";
import logger from "../core/logger.core";

class _InsightService {
  async getAllPackagesOfCreator(query: any) {
    try {
      return await prisma.patronCreator.findMany({
        where: query,
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const InsightService = new _InsightService();
