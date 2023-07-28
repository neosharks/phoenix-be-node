import express from "express";
import { PackageController } from "../controllers/package.controller";
import fetchUser from "../middlewares/fetchUser.middleware";

const packageRoutes = express.Router();

packageRoutes.post("/createOnePackage", fetchUser, PackageController.createOnePackage);

packageRoutes.get("/getPackageByUser", fetchUser, PackageController.getPackageByUser);

packageRoutes.get("/getPackage", fetchUser, PackageController.getPackage);

packageRoutes.post("/buyPackage", fetchUser, PackageController.buyPackage);

//-------------------

packageRoutes.post("/createOneTier", fetchUser, PackageController.createOneTier);

packageRoutes.get("/getAllTier", fetchUser, PackageController.getAllTier);

export default packageRoutes;
