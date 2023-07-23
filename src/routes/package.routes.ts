import express from "express";
import { PackageController } from "../controllers/package.controller";

const packageRoutes = express.Router();

packageRoutes.post("/createOnePackage", PackageController.createOnePackage);

packageRoutes.get("/getPackageByUser", PackageController.getPackageByUser);

packageRoutes.get("/getPackage", PackageController.getPackage);

//-------------------

packageRoutes.post("/createOneTier", PackageController.createOneTier);

export default packageRoutes;
