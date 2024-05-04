import { Request, Response } from "express";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { CommonService } from "../services/common.service";
import { UserService } from "../services/user.service";

class _CommonController {
  async getS3SignedUrl(req: Request, res: Response) {
    return res.status(200).send({ message: successMessages.SUCCESS });
  }

  async clickStream(req: Request, res: Response) {
    try {
      const { userId, type, info } = req.body;
      const ipAddress = req.ip;
      const payload: any = { type, info: { ...info, ipAddress } };
      if (userId) {
        const foundUser = await UserService.getOneUser({ id: userId });
        if (!foundUser)
          return res.status(errorCode.GENERIC).send({ message: errorMessage.USER_NOT_FOUND });
        payload.userId = userId;
      }
      await CommonService.createClickStream(payload);
      return res.status(200).send({ message: successMessages.SUCCESS });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const CommonController = new _CommonController();
