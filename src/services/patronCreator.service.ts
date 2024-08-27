import PatronCreator from "../models/patronCreator.model";
class _PatronCreatorService {
  async getFirst(query: any) {
    try {
      return await PatronCreator.findOne({ where: query });
    } catch (error) {
      throw error;
    }
  }

  async getOne(query: any) {
    try {
      return await PatronCreator.findOne({
        where: query,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAll(query: any, skip: number = 0, take: number = 10) {
    try {
      return await PatronCreator.findAll({
        where: query,
        include: [
          {
            model: "Package",
            as: "package",
          },
          {
            model: "User",
            as: "creator",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "industry",
            ],
          },
          {
            model: "User",
            as: "patron",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "industry",
            ],
          },
        ],
        offset: skip,
        limit: take,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const PatronCreatorService = new _PatronCreatorService();
