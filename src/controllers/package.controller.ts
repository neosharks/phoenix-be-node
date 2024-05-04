import { Request, Response } from "express";
import { PackageService } from "../services/package.service";
import { ChatService } from "../services/chat.service";
import { PatronCreatorService } from "../services/patronCreator.service";
import prisma from "../../prisma";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";
import { PaymentService } from "../services/payment.service";
import { updatePackageSchema } from "../validators/package.validator";
import { UserService } from "../services/user.service";

export const AssignTierAndLink = async (foundPackage: any, user: any) => {
  const { tier, creatorId } = foundPackage;
  tier &&
    tier.length > 0 &&
    tier.map(async (ele: any) => {
      if (ele.tierType === "ONE_TIME_MESSAGE") {
        const foundChat = await ChatService.getOneChat({
          OR: [
            { participantOneId: user.id, participantTwoId: creatorId },
            { participantOneId: creatorId, participantTwoId: user.id },
          ],
        });
        if (!foundChat) await ChatService.createOneChat([user.id, creatorId], "LIMITED");
        else
          await ChatService.updateOneChat(
            { id: foundChat.id },
            { pendingAllowed: foundChat.pendingAllowed + 1 },
          );
      }
      if (ele.tierType === "UNLIMITED_MESSAGE") {
        const foundChat = await ChatService.getOneChat({
          OR: [
            { participantOneId: user.id, participantTwoId: creatorId },
            { participantOneId: creatorId, participantTwoId: user.id },
          ],
        });
        if (!foundChat) await ChatService.createOneChat([user.id, creatorId], "UNLIMITED");
        else
          await ChatService.updateOneChat(
            { id: foundChat.id },
            { pendingAllowed: foundChat.pendingAllowed + 1000 },
          );
      }
    });
  await PackageService.linkPatronCreator(user.id, foundPackage.creatorId, "PAID", foundPackage.id);
};

class _PackageController {
  async getAllPackagesOfCreator(req: Request, res: Response) {
    try {
      const { username } = req.params;
      if (!username) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const foundUser = await UserService.getOneUser({ username });
      if (!foundUser)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.USER_NOT_FOUND });
      const found = await PackageService.getAllPackagesOfCreator({
        creatorId: foundUser.id,
      });
      if (!found) return res.status(errorCode.NOT_FOUND).send({ message: errorMessage.NOT_FOUND });
      return res.status(200).send({ message: successMessages.SUCCESS, packages: found });
    } catch (error) {
      console.log("ERROR: ", error);
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
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getPackageNames(req: Request, res: Response) {
    const { username } = res.locals.user;
    try {
      if (!username)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundUser = await UserService.getOneUser({ username });
      if (!foundUser)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.USER_NOT_FOUND });
      const found = await PackageService.getAllPackagesOfCreator({
        creatorId: foundUser.id,
      });
      let allPackagesEnums = ["SUPPORT", "BRONZE", "SILVER", "GOLD", "PLATINUM", "RUBY"];
      if (found && found.length > 0) {
        found.forEach((ele) => {
          allPackagesEnums = allPackagesEnums.filter((item) => item !== ele.name);
        });
      }
      return res.status(201).send({
        message: successMessages.SUCCESS,
        data: allPackagesEnums,
      });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async useGetAllSubscriptions(req: Request, res: Response) {
    try {
      const { username } = req.params;
      if (!username)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const found = await PatronCreatorService.getAll({
        patron: {
          username: username,
        },
      });
      if (!found) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(200).send({ message: successMessages.SUCCESS, data: found });
    } catch (error) {
      console.log("ERROR: ", error);
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
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async createOnePackage(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const { tier, name, price, description } = req.body;
      const allUserPackages = await PackageService.getAllPackagesOfCreator({ creatorId: id });
      const packageIndex = allUserPackages.findIndex((pac: any) => pac.name === name);
      if (packageIndex !== -1)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.DUPLICATE_ENTRY });
      await PackageService.createOnePackage({ tier, name, price, description, creatorId: id });
      res.status(201).send({ message: successMessages.CREATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async updatePackage(req: Request, res: Response) {
    try {
      const postId = req.body.id;
      const validation = updatePackageSchema.validate(req.body, { stripUnknown: true });
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      const foundPackage = await PackageService.getOnePackage({ id: postId });
      if (!foundPackage)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      await PackageService.updatePackage({ id: postId }, req.body);
      res.status(201).send({ message: successMessages.CREATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async buyPackage(req: Request, res: Response) {
    try {
      const { packageId, orderID } = req.body;
      if (!packageId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const user = res.locals.user;
      const foundPackage = await PackageService.getOnePackage({ id: packageId });
      if (!foundPackage)
        return res
          .status(errorCode.NOT_FOUND)
          .send({ message: errorMessage.NOT_FOUND, info: "Package not found" });
      const { tier, creatorId } = foundPackage;
      const tierUserPackage = await PackageService.getOnePackage({
        id: packageId,
        creatorId: user.id,
      });
      if (tierUserPackage)
        return res
          .status(errorCode.GENERIC)
          .send({ message: errorMessage.NOT_ALLOWED, info: "Cannot buy own package" });
      const foundAlreadyPurchase = await PatronCreatorService.getFirst({
        patronId: user.id,
        creatorId,
        packageId: foundPackage.id,
      });
      if (foundAlreadyPurchase)
        return res
          .status(400)
          .send({ message: errorMessage.REDUNDANT_REQUEST, info: "Package already purchased" });

      if (foundPackage.price !== 0) {
        const foundPayment = await PaymentService.getOnePaymentByProps({ status: "PAID", orderID });
        if (!foundPayment)
          return res.status(400).send({
            message: errorMessage.NO_PAYMENT,
            info: "Payment not found for this purchase",
          });
        if (foundPayment.userId !== user.id || foundPayment.packageId !== packageId)
          return res
            .status(400)
            .send({ message: errorMessage.DATA_MISMATCH, info: "Data mismatch for the purchase" });
      }

      tier &&
        tier.length > 0 &&
        tier.map(async (ele) => {
          if (ele.tierType === "ONE_TIME_MESSAGE") {
            const foundChat = await ChatService.getOneChat({
              OR: [
                { participantOneId: user.id, participantTwoId: creatorId },
                { participantOneId: creatorId, participantTwoId: user.id },
              ],
            });
            if (!foundChat) await ChatService.createOneChat([user.id, creatorId], "LIMITED");
            else
              await ChatService.updateOneChat(
                { id: foundChat.id },
                { pendingAllowed: foundChat.pendingAllowed + 1 },
              );
          }
          if (ele.tierType === "UNLIMITED_MESSAGE") {
            const foundChat = await ChatService.getOneChat({
              OR: [
                { participantOneId: user.id, participantTwoId: creatorId },
                { participantOneId: creatorId, participantTwoId: user.id },
              ],
            });
            if (!foundChat) await ChatService.createOneChat([user.id, creatorId], "UNLIMITED");
            else
              await ChatService.updateOneChat(
                { id: foundChat.id },
                { pendingAllowed: foundChat.pendingAllowed + 1000 },
              );
          }
        });
      await PackageService.linkPatronCreator(user.id, foundPackage.creatorId, "PAID", packageId);

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
      console.log("ERROR: ", error);
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
      console.log("ERROR: ", error);
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
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const PackageController = new _PackageController();
