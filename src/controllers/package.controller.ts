import { Request, Response } from "express";
import { PackageService } from "../services/package.service";

class _PackageController {
  async getPackageByUser(req: Request, res: Response) {
    const { id } = req.query;
    const found = await PackageService.getAllUserPackages({ userId: id });
    res.status(201).send({ message: "success", data: found });
  }

  async getPackage(req: Request, res: Response) {
    const { id } = req.query;
    const found = await PackageService.getPackage({ id });
    res.status(201).send({ message: "success", data: found });
  }

  async createOnePackage(req: Request, res: Response) {
    const body = req.body;
    await PackageService.createOnePackage(body);
    res.status(201).send({ message: "created" });
  }

  //----------------------------

  async createOneTier(req: Request, res: Response) {
    const body = req.body;
    await PackageService.createOneTier(body);
    res.status(201).send({ message: "created" });
  }
}

export const PackageController = new _PackageController();
