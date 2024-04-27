import { Request, Response } from "express";
import Joi from "joi";
import { UserService } from "../services/user.service";
import logger from "../core/logger.core";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { GetUploadedFile } from "../core/s3upload.core";

import { PackageService } from "../services/package.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import { userUpdateSchema } from "../validators/user.validator";

class _UserController {
  async getUser(req: Request, res: Response) {
    try {
      const id = res.locals.user.id;
      const found = await UserService.getOneUser({ id });
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
      const { update } = req.body;
      const validation = userUpdateSchema.validate(update);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      const image = req.file;
      if (image) update.profileImage = await GetUploadedFile(image);
      await UserService.updateOneUser({ id: res.locals.user.id }, update);
      return res.status(200).json({ message: successMessages.UPDATED });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async joinForFree(req: Request, res: Response) {
    try {
      const { user } = res.locals;
      const { creatorId } = req.body;
      if (!creatorId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundPatronCreator = await PatronCreatorService.getFirst({
        creatorId,
        patronId: user.id,
        type: "FREE",
      });
      if (foundPatronCreator)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.REDUNDANT_REQUEST });
      await PackageService.linkPatronCreator(user.id, creatorId, "FREE", undefined);
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
      const { data } = req.body;
      const validation = userUpdateSchema.validate(data, { stripUnknown: true });
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      const foundUser = await UserService.getOneUser({ id });
      if (!foundUser) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      if (foundUser.role.includes("CREATOR"))
        return res.status(400).send({ message: errorMessage.REDUNDANT_REQUEST });

      const updatedBody = {
        ...data,
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

  async delete(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      await UserService.deleteOneUser(id);
      return res.status(200).json({ messge: successMessages.SUCCESS });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const UserController = new _UserController();
