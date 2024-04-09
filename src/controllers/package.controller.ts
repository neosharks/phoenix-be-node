import { Request, Response } from "express";
import { PackageService } from "../services/package.service";
import { ChatService } from "../services/chat.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import prisma from "../../prisma";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";

class _PackageController {
  async getAllPackagesOfCreator(req: Request, res: Response) {
    try {
      const { username } = req.params;
      if (!username) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const found = await PackageService.getAllPackagesOfCreator({
        User: {
          username: username,
        },
      });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(200).send({ message: successMessages.SUCCESS, packages: found });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getOnePackage(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const found = await PackageService.getOnePackage({ id });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(201).send({ message: successMessages.SUCCESS, data: found });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async useGetAllSubscriptions(req: Request, res: Response) {
    try {
      const { username } = req.params;
      if (!username) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const found = await PatronCreatorService.getAll({
        patron: {
          username: username,
        },
      });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(201).send({ message: successMessages.SUCCESS, data: found });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllPatronsByCreator(req: Request, res: Response) {
    try {
      const { username } = req.params;
      if (!username) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const found = await PatronCreatorService.getAll({
        creator: {
          username: username,
        },
      });
      if (!found) return res.status(404).send({ message: errorMessage.MISSING_PARAMS });
      return res.status(201).send({ message: successMessages.SUCCESS, data: found });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async createOnePackage(req: Request, res: Response) {
    try {
      const body = req.body;
      await PackageService.createOnePackage(body);
      res.status(201).send({ message: successMessages.CREATED });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async buyPackage(req: Request, res: Response) {
    try {
      const { packageId } = req.body;
      if (!packageId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const user = res.locals.user;
      const foundPackage = await PackageService.getOnePackage({ id: packageId });
      if (!foundPackage) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      const { tier, userId } = foundPackage;
      const tierUserPackage = await PackageService.getOnePackage({
        id: packageId,
        userId: user.id,
      });
      if (tierUserPackage) return res.status(400).send({ message: errorMessage.NOT_ALLOWED });
      const foundAlreadyPurchase = await PatronCreatorService.getFirst({
        patronId: user.id,
        creatorId: userId,
        packageId: foundPackage.id,
      });
      if (foundAlreadyPurchase)
        return res.status(400).send({ message: errorMessage.REDUNDANT_REQUEST });

      tier &&
        tier.length > 0 &&
        tier.map(async (ele) => {
          if (ele.tierType === "ONE_TIME_MESSAGE") {
            const chats = await prisma.chat.findMany({
              where: {
                OR: [{ participantOneId: userId }, { participantTwoId: userId }],
              },
            });
            if (chats.length === 0) await ChatService.createOneChat([user.id, userId], "LIMITED");
          }
          if (ele.tierType === "UNLIMITED_MESSAGE") {
            const chats = await prisma.chat.findMany({
              where: {
                OR: [{ participantOneId: userId }, { participantTwoId: userId }],
              },
            });
            if (chats.length === 0) await ChatService.createOneChat([user.id, userId], "UNLIMITED");
          }
          if (ele.tierType === "GENERAL_SUPPORT") {
            //
          }
          if (ele.tierType === "EARLY_TICKETS") {
            //
          }
          if (ele.tierType === "DIGITAL_DOWNLOADS") {
            //
          }
          if (ele.tierType === "BEHIND_THE_SCENES") {
            //
          }
        });
      await PackageService.linkPatronCreator(user.id, foundPackage.userId, packageId, Date.now());

      return res.status(201).send({ message: successMessages.SUCCESS });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  //----------------------------

  async createOneTier(req: Request, res: Response) {
    try {
      const body = req.body;
      await PackageService.createOneTier(body);
      res.status(201).send({ message: successMessages.CREATED });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async createManyTier(req: Request, res: Response) {
    try {
      const { tiers } = req.body;
      tiers.map(async (ele: any) => {
        await PackageService.createOneTier(ele);
      });
      res.status(201).send({ message: successMessages.CREATED });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllTiers(req: Request, res: Response) {
    try {
      const tiers = await PackageService.getAllTiers();
      res.status(201).send({ message: successMessages.FETCHED, tiers: tiers });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const PackageController = new _PackageController();
