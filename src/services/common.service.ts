import prisma from "../../prisma";
import logger from "../core/logger.core";

class _CommonService {
  async createClickStream(data: any) {
    try {
      return await prisma.clickStream.create({ data: data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const CommonService = new _CommonService();
