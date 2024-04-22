import prisma from "../../prisma";

class _InsightService {
  async getAllPackagesOfCreator(query: any) {
    try {
        return await prisma.patronCreator.findMany({
            where:query,
            orderBy: [
                {
                  createdAt: 'asc',
                },
            ]
        })

    } catch (error) {
        console.error(error);
    }
  }

}

export const InsightService = new _InsightService();
