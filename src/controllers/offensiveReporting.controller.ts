import { Request, Response } from "express";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { OffensiveReportingService } from "../services/offensiveReporting.service";

class _OffensiveReportingController {
  async create(req: Request, res: Response) {
    try {
      const { type, reportedByUserId, reportedUserId, message } = req.body;

      if (!type || !reportedByUserId || !reportedUserId || !message)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });

      await OffensiveReportingService.createOne({
        type,
        reportedByUserId,
        reportedUserId,
        message,
      });

      return res.status(200).send({ message: successMessages.SUCCESS });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const OffensiveReportingController = new _OffensiveReportingController();
