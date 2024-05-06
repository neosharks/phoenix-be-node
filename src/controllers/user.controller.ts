import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import logger from "../core/logger.core";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { GetUploadedFile, getObjectSignedUrl } from "../core/s3upload.core";

import { PackageService } from "../services/package.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import { userUpdateSchema } from "../validators/user.validator";

class _UserController {
  async getUser(req: Request, res: Response) {
    try {
      const id = res.locals.user.id;
      const found = await UserService.getOneUser({ id });
      if (!found) return res.status(400).send({ message: errorMessage.NOT_FOUND });
      if (found.profileImage) found.profileImage = await getObjectSignedUrl(found.profileImage);
      if (found.coverImage) found.coverImage = await getObjectSignedUrl(found.coverImage);
      return res.status(201).send({ message: successMessages.SUCCESS, user: found });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllLinks(req: Request, res: Response) {
    try {
      const { username } = req.params;
      if (!username || typeof username !== "string")
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const found = await UserService.getOneUser({ username });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      const allLinks = await UserService.getAllLinks({ id: found.id });
      return res.status(200).send({ message: successMessages.SUCCESS, allLinks });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async createLink(req: Request, res: Response) {
    try {
      const { url, platform, highlight } = req.body;
      const { id } = res.locals.user;
      if (!url) return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      await UserService.createLink({ userId: id, url, platform, highlight });
      return res.status(200).json({ message: successMessages.CREATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getUserByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      if (!username || typeof username !== "string")
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const found = await UserService.getOneUser({ username });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      if (found.coverImage) found.coverImage = await getObjectSignedUrl(found.coverImage);
      if (found.profileImage) found.profileImage = await getObjectSignedUrl(found.profileImage);
      return res.status(200).send({ message: successMessages.SUCCESS, user: found });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllCreator(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const skip = req.query.page || 0;
      const take = req.query.setPage || 10;
      let found = await UserService.getAllUserByParams(
        { isCreator: true },
        Number(skip),
        Number(take),
      );
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      found = found.filter((ele) => ele.id !== id);
      if (found.length > 0) {
        found = await Promise.all(
          found.map(async (ele: any) => {
            if (ele?.profileImage?.length > 0)
              ele.profileImage = await getObjectSignedUrl(ele.profileImage);
            if (ele?.coverImage?.length > 0)
              ele.coverImage = await getObjectSignedUrl(ele.coverImage);
            return ele;
          }),
        );
      }
      return res.status(200).send({ message: successMessages.SUCCESS, data: found });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async updateCoverImage(req: Request, res: Response) {
    try {
      const image = req.file;
      let update: any = {};
      if (image) update.coverImage = await GetUploadedFile(image);
      await UserService.updateOneUser({ id: res.locals.user.id }, update);
      return res.status(200).json({ message: successMessages.UPDATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async updateProfileImage(req: Request, res: Response) {
    try {
      const image = req.file;
      let update: any = {};
      if (image) update.profileImage = await GetUploadedFile(image);
      await UserService.updateOneUser({ id: res.locals.user.id }, update);
      return res.status(200).json({ message: successMessages.UPDATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const validation = userUpdateSchema.validate(req.body, { stripUnknown: true });
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      const image = req.file;
      if (image) req.body.profileImage = await GetUploadedFile(image);
      await UserService.updateOneUser({ id: res.locals.user.id }, req.body);
      return res.status(200).json({ message: successMessages.UPDATED });
    } catch (error) {
      console.log("ERROR: ", error);
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
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async creatorOnboard(req: Request, res: Response) {
    try {
      const { id, username } = res.locals.user;
      const validation = userUpdateSchema.validate(req.body, { stripUnknown: true });
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      const foundUser = await UserService.getOneUser({ id });
      if (!foundUser) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      if (foundUser.role.includes("CREATOR"))
        return res.status(400).send({ message: errorMessage.REDUNDANT_REQUEST });
      const foundUsername = await UserService.getOneUser({ username });
      if (foundUsername && foundUsername.id !== id)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.DUPLICATE_USERNAME });

      const updatedBody = {
        ...req.body,
        isCreator: true,
        role: ["CREATOR", ...foundUser.role],
      };
      await UserService.updateOneUser({ id }, updatedBody);
      return res.status(201).send({ message: successMessages.SUCCESS });
    } catch (error) {
      console.log("ERROR: ", error);
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
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const UserController = new _UserController();
