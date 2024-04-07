import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import logger from "../core/logger.core";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { generateFileName, getObjectSignedUrl, uploadFile } from "../core/s3upload.core";
import Jimp from "jimp";

class _UserController {
  async getUser(req: Request, res: Response) {
    try {
      const id = res.locals.user.id;
      const found = await UserService.getOneUser({ id });
      if (found?.profileImage) found.profileImage = await getObjectSignedUrl(found.profileImage);
      return res.status(201).send({ message: successMessages.SUCCESS, user: found });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getUserByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      if (!username) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const found = await UserService.getOneUser({ username });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(200).send({ message: successMessages.SUCCESS, user: found });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllCreator(req: Request, res: Response) {
    try {
      const found = await UserService.getAllUserByParams({ isCreator: true });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(200).send({ message: successMessages.SUCCESS, data: found });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const { profileImage, ...update } = req.body;
      if (profileImage) {
        const imageName = generateFileName();
        const jimpImage = await Jimp.read(profileImage.buffer);
        const buffer = await jimpImage.getBufferAsync(profileImage.mimetype);
        await uploadFile(buffer, imageName, profileImage.mimetype);
        update.profileImage = imageName;
      }
      await UserService.updateOneUser({ id: res.locals.user.id }, update);
      return res.status(200).json({ message: successMessages.UPDATED });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async creatorOnboard(req: Request, res: Response) {
    try {
      const id = res.locals.user.id;
      const {
        pageName,
        industry,
        gender,
        description,
        youtubeHandle,
        instagramHandle,
        facebookHandle,
        twitterHandle,
      } = req.body;
      const foundUser = await UserService.getOneUser({ id });
      if (!foundUser) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      if (foundUser.role.includes("CREATOR"))
        return res.status(400).send({ message: errorMessage.REDUNDANT_REQUEST });
      const updatedBody = {
        pageName,
        industry,
        gender,
        bio: description,
        youtubeHandle,
        instagramHandle,
        facebookHandle,
        twitterHandle,
        isCreator: true,
        role: ["CREATOR", ...foundUser.role],
      };
      await UserService.updateOneUser({ id }, updatedBody);
      return res.status(201).send({ message: successMessages.SUCCESS });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const UserController = new _UserController();
