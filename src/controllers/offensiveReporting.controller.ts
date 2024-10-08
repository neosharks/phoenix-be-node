import { Request, Response } from "express";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { OffensiveReportingService } from "../services/offensiveReporting.service";

class _OffensiveReportingController {
  async create(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const { type, message, reportedUserId, userPostId } = req.body;
      if (!type || !message)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      if (type === "USER" || !reportedUserId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      if (type === "POST" || !userPostId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });

      await OffensiveReportingService.createOne({
        type,
        reportedByUserId: id,
        message,
        ...req.body,
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
