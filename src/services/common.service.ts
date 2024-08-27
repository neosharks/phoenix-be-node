import ClickStream from "../models/clickStream.model";
class _CommonService {
  async createClickStream(data: any) {
    try {
      return await ClickStream.create(data);
    } catch (error) {
      throw error;
    }
  }
}

export const CommonService = new _CommonService();
