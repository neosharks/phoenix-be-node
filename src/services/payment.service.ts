import prisma from "../../prisma";

class _PaymentService {
  async getAllPaymentByProps(query: any) {
    return await prisma.payment.findMany({ where: query });
  }

  async getOnePaymentByProps(query: any) {
    try {
      return await prisma.payment.findUnique({ where: query });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createOnePayment(dataValues: any) {
    try {
      const { userId, orderId, packageId } = dataValues;
      return await prisma.payment.create({
        data: {
          userId,
          orderId,
          packageId,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async updateOneByProps(query: any, data: any) {
    try {
      return await prisma.payment.update({ where: query, data: data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const PaymentService = new _PaymentService();
