import prisma from "../../prisma";

class _WalletService {
  async getAllWalletByProps(query: any) {
    try {
      return await prisma.walletTransactions.findMany({ where: query });
    } catch (error) {
      throw error;
    }
  }

  async getOneWalletByProps(query: any) {
    try {
      return await prisma.walletTransactions.findFirst({ where: query });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createOneWalletTransactions(dataValues: any) {
    try {
      const { receiverId, source, paymentId, amount, currency, cashFlow, state, senderId } =
        dataValues;
      return await prisma.walletTransactions.create({
        data: {
          receiverId,
          source,
          paymentId,
          amount,
          currency,
          cashFlow,
          state,
          senderId,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateOneByProps(query: any, data: any) {
    try {
      return await prisma.walletTransactions.update({ where: query, data: data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const WalletService = new _WalletService();
