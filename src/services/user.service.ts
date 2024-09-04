import User from "../models/user.model";
class _UserService {
  async getOneUser(query: any) {
    try {
      return await User.findOne({ where: query });
    } catch (error) {
      throw error;
    }
  }

  async getAllUserByParams(query: any, skip: number = 0, take: number = 10) {
    try {
      return await User.findAll({
        where: query,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "profileImage",
          "email",
          "username",
          "role",
          "industry",
          "coverImage",
        ],
        offset: skip,
        limit: take,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllUser(skip: number = 0, take: number = 10) {
    try {
      return await User.findAll({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "profileImage",
          "email",
          "username",
          "phoneNumber",
          "role",
        ],
        offset: skip,
        limit: take,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllTotalUser() {
    try {
      return await User.findAll();
    } catch (error) {
      throw error;
    }
  }

  async createOneUser(data: any) {
    try {
      return await User.create(data);
    } catch (error) {
      throw error;
    }
  }

  async updateOneUser(query: any, data: any) {
    try {
      return await User.update(data, { where: query });
    } catch (error) {
      throw error;
    }
  }

  async deleteOneUser(id: any) {
    try {
      return await User.destroy({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}

export const UserService = new _UserService();
