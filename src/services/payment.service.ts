import prisma from "../../prisma";
class _PaymentService {
  async getAllPaymentByProps(query: any) {
    try {
      return await prisma.payment.findMany({ where: query });
    } catch (error) {
      throw error;
    }
  }

  async getOnePaymentByProps(query: any) {
    try {
      return await prisma.payment.findFirst({
        where: query,
        include: {
          class: {
            select: {
              creatorId: true,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createOneClassPayment(dataValues: any) {
    try {
      const { userId, orderId, classId, amount, currency, paymentFor } = dataValues;
      return await prisma.payment.create({
        data: {
          userId,
          orderId,
          classId,
          amount,
          currency,
          paymentFor,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateOneByProps(query: any, data: any) {
    try {
      return await prisma.payment.update({ where: query, data: data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const PaymentService = new _PaymentService();
