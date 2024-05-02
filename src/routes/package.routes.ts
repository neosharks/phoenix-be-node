import express from "express";
import { PackageController } from "../controllers/package.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";

const packageRoutes = express.Router();

packageRoutes.post(
  "/createOnePackage",
  checkRoleAuth([userRole.CREATOR]),
  PackageController.createOnePackage,
);

packageRoutes.post(
  "/updatePackage",
  checkRoleAuth([userRole.CREATOR]),
  PackageController.updatePackage,
);

packageRoutes.get("/getAllPackagesOfCreator/:username", PackageController.getAllPackagesOfCreator);

packageRoutes.get("/getOnePackage", checkRoleAuth(), PackageController.getOnePackage);

packageRoutes.get(
  "/getPackageNames",
  checkRoleAuth([userRole.CREATOR]),
  PackageController.getPackageNames,
);

packageRoutes.get(
  "/getAllSubscriptions/:username",
  checkRoleAuth(),
  PackageController.useGetAllSubscriptions,
);

packageRoutes.get("/getAllPatronsByCreator/:username", PackageController.getAllPatronsByCreator);

packageRoutes.post("/buyPackage", checkRoleAuth(), PackageController.buyPackage);

//-------------------

packageRoutes.post(
  "/createOneTier",
  checkRoleAuth([userRole.ADMIN]),
  PackageController.createOneTier,
);

packageRoutes.post("/createManyTier", PackageController.createManyTier);

packageRoutes.get("/getAllTiers", checkRoleAuth(), PackageController.getAllTiers);

export default packageRoutes;
