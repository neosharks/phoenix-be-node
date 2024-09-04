import Payment from "../models/payment.model";
class _PaymentService {
  async getAllPaymentByProps(query: any) {
    try {
      return await Payment.findAll({ where: query });
    } catch (error) {
      throw error;
    }
  }

  async getOnePaymentByProps(query: any) {
    try {
      return await Payment.findOne({ where: query });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createOnePayment(dataValues: any) {
    try {
      return await Payment.create(dataValues);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateOneByProps(query: any, data: any) {
    try {
      return await Payment.update(data, { where: query });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const PaymentService = new _PaymentService();
