import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import logger from "../core/logger.core";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import User from "../models/user.model";
import { PackageService } from "../services/package.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import { userUpdateSchema } from "../validators/user.validator";
import sendEmail from "../core/email.core";
class _UserController {
  async getUser(req: Request, res: Response) {
    try {
      const id = res.locals.user.id;
      const found = await UserService.getOneUser({ id });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(200).send({ message: successMessages.SUCCESS, user: found });
    } catch (error) {
      logger.error("Error in getUser:", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
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
      logger.error("Error in getAllLinks:", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async createLink(req: Request, res: Response) {
    try {
      const { url, platform, highlight } = req.body;
      const { id } = res.locals.user;

      if (!url) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      await UserService.createLink({ userId: id, url, platform, highlight });
      return res.status(201).json({ message: successMessages.CREATED });
    } catch (error) {
      logger.error("Error in createLink:", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async getUserByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;

      if (!username || typeof username !== "string")
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      const found = await UserService.getOneUser({ username });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });

      return res.status(200).send({ message: successMessages.SUCCESS, user: found });
    } catch (error) {
      logger.error("Error in getUserByUsername:", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async getAllCreator(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
      const take = Number(req.query.per_page) || 10;

      let found = await UserService.getAllUserByParams({ isCreator: true }, skip, take);
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });

      found = found.filter((ele: any) => ele.id !== id);
      return res.status(200).send({ message: successMessages.SUCCESS, data: found });
    } catch (error) {
      logger.error("Error in getAllCreator:", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async updateCoverImage(req: Request, res: Response) {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      const update = { coverImage: image };
      await UserService.updateOneUser({ id: res.locals.user.id }, update);
      return res.status(200).json({ message: successMessages.UPDATED });
    } catch (error) {
      logger.error("Error in updateCoverImage:", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async updateProfileImage(req: Request, res: Response) {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      const update = { profileImage: image };
      await UserService.updateOneUser({ id: res.locals.user.id }, update);
      return res.status(200).json({ message: successMessages.UPDATED });
    } catch (error) {
      logger.error("Error in updateProfileImage:", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const validation = userUpdateSchema.validate(req.body);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }

      const { image } = req.body;
      const update = image ? { ...req.body, profileImage: image } : req.body;

      await UserService.updateOneUser({ id: res.locals.user.id }, update);
      return res.status(200).json({ message: successMessages.UPDATED });
    } catch (error) {
      logger.error("Error in update:", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async joinForFree(req: Request, res: Response) {
    try {
      const { creatorId } = req.body;
      if (!creatorId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      const { user } = res.locals;
      const foundPatronCreator = await PatronCreatorService.getFirst({
        creatorId,
        patronId: user.id,
        type: "FREE",
      });

      if (foundPatronCreator)
        return res.status(400).send({ message: errorMessage.REDUNDANT_REQUEST });

      await PackageService.linkPatronCreator(user.id, creatorId, "FREE");
      return res.status(201).json({ message: successMessages.UPDATED });
    } catch (error) {
      logger.error("Error in joinForFree:", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async creatorOnboard(req: Request, res: Response) {
    try {
      const { id, username } = res.locals.user;
      const validation = userUpdateSchema.validate(req.body);
      if (validation.error)
        return res.status(400).json({ error: validation.error.details[0].message });

      const foundUser = await UserService.getOneUser({ id });
      if (!foundUser) return res.status(404).send({ message: errorMessage.NOT_FOUND });

      if (foundUser.role.includes("CREATOR"))
        return res.status(400).send({ message: errorMessage.REDUNDANT_REQUEST });

      const foundUsername = await UserService.getOneUser({ username });
      if (foundUsername && foundUsername.id !== id)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.DUPLICATE_USERNAME });

      // Ensure email uniqueness check before update
      if (req.body.email) {
        const existingUserWithEmail = await UserService.getOneUser({ email: req.body.email });
        if (existingUserWithEmail && existingUserWithEmail.id !== id)
          return res.status(errorCode.GENERIC).send({ message: "Email already exists" });
      }
      const updatedBody = {
        ...req.body,
        creatorApprovalStatus: "PENDING",
      };
      await UserService.updateOneUser({ id }, updatedBody);
      // const emailSent = await sendEmail(
      //   req.body.email,
      //   "Creator Application Under Review",
      //   "APPLY_CREATOR",
      // );
      // if (!emailSent) {
      //   return res.status(500).send({ message: "Failed to send email" });
      // }
      return res.status(201).send({ message: successMessages.SUCCESS });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  // async approveCreatorOnboard(req: Request, res: Response) {
  //   try {
  //     const { users } = req.body;
  //     for (let i = 0; i < users.length; i++) {
  //       const ele = users[i];
  //       const foundUser = await UserService.getOneUser({ id: ele });
  //       if (foundUser && !foundUser.isCreator) {
  //         const updatedBody = {
  //           isCreator: true,
  //           role: ["CREATOR", ...foundUser.role],
  //           creatorApprovalStatus: "APPROVED",
  //           creatorChangeTimeStamp: new Date(),
  //         };
  //         await UserService.updateOneUser({ id: ele }, updatedBody);
  //         // if (foundUser.email)
  //         //   await sendEmail(foundUser.email, "Application Approval", "APPROVE_CREATOR");
  //       }
  //     }
  //     return res.status(201).send({ message: successMessages.SUCCESS });
  //   } catch (error) {
  //     console.log("ERROR: ", error);
  //     return res
  //       .status(errorCode.INTERNAL_SERVER)
  //       .json({ message: errorMessage.INTERNAL_SERVER, error: error });
  //   }
  // }

  async approveCreatorOnboard(req: Request, res: Response) {
    try {
      const { users } = req.body;
      for (let i = 0; i < users.length; i++) {
        const userId = users[i];
        const foundUser = await User.findByPk(userId);
        if (foundUser && !foundUser.isCreator) {
          await foundUser.update({
            isCreator: true,
            role: [...foundUser.role, "CREATOR"],
            creatorApprovalStatus: "APPROVED",
            creatorChangeTimeStamp: new Date(),
          });
        }
      }
      return res.status(201).send({ message: "User approval successful." });
    } catch (error) {
      console.error("ERROR: ", error);
      return res.status(500).json({ message: "Internal server error", error });
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

  async getAllTotalUser(req: Request, res: Response) {
    try {
      const found = await UserService.getAllTotalUser();
      if (!found) return res.status(400).send({ message: errorMessage.NOT_FOUND });
      return res.status(201).send({ message: successMessages.SUCCESS, user: found });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const UserController = new _UserController();
