import prisma from "../../prisma";

class _OffensiveReportingService {
  async getAllByProps(query: any, skip: number = 0, take: number = 10) {
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

  async createOne(dataValues: any) {
    try {
      const { type, reportedByUserId, reportedUserId, message } = dataValues;
      return await prisma.offensiveReporting.create({
        data: {
          type,
          reportedByUserId,
          reportedUserId,
          message,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const OffensiveReportingService = new _OffensiveReportingService();
