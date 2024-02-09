import { Request, Response } from "express";

class _CommonController {
  async getS3SignedUrl(req: Request, res: Response) {
    return res.status(200).send({ message: "success" });
  }
}

export const CommonController = new _CommonController();
