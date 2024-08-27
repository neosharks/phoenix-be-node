import PatronCreator from "../models/patronCreator.model";
class _InsightService {
  async getAllPackagesOfCreator(query: any, skip: number = 0, take: number = 10) {
    try {
      return await PatronCreator.findAll({
        where: query,
        order: [["createdAt", "ASC"]],
        offset: skip,
        limit: take,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const InsightService = new _InsightService();
