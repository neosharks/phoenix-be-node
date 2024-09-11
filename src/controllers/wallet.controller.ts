import { Request, Response } from "express";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";
import { WalletService } from "../services/wallet.service";

class _WalletController {
  async getAll(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const allTransactions = await WalletService.getAllWalletByProps({ receiverId: id });
      return res.status(200).send({ message: successMessages.FETCHED, data: allTransactions });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async withdraw(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const { withdrawAmount } = req.body;
      const allTransactions = await WalletService.getAllWalletByProps({ receiverId: id });
      const totalEarned = allTransactions
        .filter((tx) => tx.cashFlow === "CREDIT")
        .reduce((sum, tx) => sum + tx.amount, 0);

      const totalRefunded = allTransactions
        .filter((tx) => tx.cashFlow === "DEBIT")
        .reduce((sum, tx) => sum + tx.amount, 0);

      const availableBalance = totalEarned - totalRefunded;
      console.log(availableBalance, "availableBalance");
      console.log(totalEarned, "totalEarned");
      console.log(totalRefunded, "totalRefunded");

      if (availableBalance < withdrawAmount) {
        return res.status(400).json({ message: "Insufficient balance for withdrawal." });
      }

      await WalletService.createOneWalletTransactions({
        recieverId: id,
        amount: withdrawAmount,
        state: "PROCESSING",
        cashFlow: "DEBIT",
      });
      await WalletService.createOneWalletTransactions({ state: "PROCESSING", cashflow: "DEBIT" });
      return res.status(200).send({ message: successMessages.CREATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const WalletController = new _WalletController();
