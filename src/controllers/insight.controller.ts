import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";
import { InsightService } from "../services/insights.service";
import { paginationSchema } from "../validators/chat.validator";

class _InsightController {
  async get(req: Request, res: Response) {
    try {
      const { id, isCreator } = res.locals.user;
      const { error, value } = paginationSchema.validate(req.query);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { omit, obtain } = value;
      if (!isCreator)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.NOT_ALLOWED });

      const d = new Date().getMonth() - 6;

      const result = await InsightService.getAllPackagesOfCreator(
        {
          creatorId: id,
        },
        omit,
        obtain,
      );

      let obj: any = {};

      result?.forEach((e) => {
        let date = new Date(e.createdAt);
        const monthName = date.toLocaleString("en-US", { month: "long" });

        if (obj[monthName]) {
          obj[monthName].push(e);
        } else {
          obj[monthName] = new Array(e);
        }
      });

      return res.status(200).send({ message: successMessages.FETCHED, data: obj });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const InsightController = new _InsightController();
