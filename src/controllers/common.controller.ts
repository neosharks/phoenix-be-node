import { Request, Response } from "express";
import { successMessages } from "../constant/api.constant";

class _CommonController {
  async getS3SignedUrl(req: Request, res: Response) {
    return res.status(200).send({ message: successMessages.SUCCESS });
  }
}

export const CommonController = new _CommonController();
