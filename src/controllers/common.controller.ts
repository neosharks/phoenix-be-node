import { Request, Response } from "express";
import { generateUploadURL } from "../core/uploadS3.core";

class _CommonController {
  async getS3SignedUrl(req: Request, res: Response) {
    const url = await generateUploadURL();
    return res.status(200).send({ message: "success", url });
  }
}

export const CommonController = new _CommonController();
