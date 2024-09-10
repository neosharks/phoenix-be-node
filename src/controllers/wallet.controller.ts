import { Request, Response } from "express";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";
import { WalletService } from "../services/wallet.service";

class _WalletController {
  async getAll(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const allTransactions = await WalletService.getAllWalletByProps({ userId: id });
      return res.status(200).send({ message: successMessages.FETCHED, data: allTransactions });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const WalletController = new _WalletController();
