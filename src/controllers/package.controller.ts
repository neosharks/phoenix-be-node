import { Request, Response } from "express";
import { PackageService } from "../services/package.service";
import { ConversationService } from "../services/conversation.service";

class _PackageController {
  async getAllPackagesByUser(req: Request, res: Response) {
    const { username } = req.params;
    if (!username) return res.status(400).send({ message: "provide username" });
    const found = await PackageService.getAllPackagesByUser({
      User: {
        username: username,
      },
    });
    if (!found) return res.status(404).send({ message: "packages cannot be found" });
    return res.status(200).send({ message: "success", packages: found });
  }

  async getOnePackage(req: Request, res: Response) {
    const { id } = req.query;
    const found = await PackageService.getOnePackage({ id });
    if (!found) return res.status(404).send({ message: "Package not found" });
    return res.status(201).send({ message: "success", data: found });
  }

  async createOnePackage(req: Request, res: Response) {
    const body = req.body;
    await PackageService.createOnePackage(body);
    res.status(201).send({ message: "created" });
  }

  async buyPackage(req: Request, res: Response) {
    const { packageId } = req.body;
    if (!packageId) return res.status(400).send({ message: "Provide package id" });
    const user = res.locals.user;
    const foundPackage = await PackageService.getOnePackage({ id: packageId });
    if (!foundPackage) return res.status(404).send({ message: "Package not found" });
    const { tier, userId } = foundPackage;
    const tierUserPackage = await PackageService.getOnePackage({ id: packageId, userId: user.id });
    if (tierUserPackage)
      return res.status(400).send({ message: "User cannot purchase his own package" });
    await PackageService.linkPatronCreator(foundPackage.userId, user.id, packageId);

    tier &&
      tier.length > 0 &&
      tier.map(async (ele) => {
        if (ele.tierType === "UNLIMITED_MESSAGE") {
          await ConversationService.createOneConversation([user.id, userId]);
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
    return res.status(201).send({ message: "success" });
  }

  //----------------------------

  async createOneTier(req: Request, res: Response) {
    const body = req.body;
    await PackageService.createOneTier(body);
    res.status(201).send({ message: "created" });
  }

  async createManyTier(req: Request, res: Response) {
    const { tiers } = req.body;
    tiers.map(async (ele: any) => {
      await PackageService.createOneTier(ele);
    });
    res.status(201).send({ message: "created" });
  }

  async getAllTiers(req: Request, res: Response) {
    const tiers = await PackageService.getAllTiers();
    res.status(201).send({ message: "succcess", tiers: tiers });
  }
}

export const PackageController = new _PackageController();
