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

packageRoutes.get("/getAllPackagesByUser/:username", PackageController.getAllPackagesByUser);

packageRoutes.get("/getOnePackage", checkRoleAuth(), PackageController.getOnePackage);

packageRoutes.post("/buyPackage", checkRoleAuth(), PackageController.buyPackage);

//-------------------

packageRoutes.post(
  "/createOneTier",
  checkRoleAuth([userRole.ADMIN]),
  PackageController.createOneTier,
);

packageRoutes.post(
  "/createManyTier",
  checkRoleAuth([userRole.ADMIN]),
  PackageController.createManyTier,
);

packageRoutes.get("/getAllTiers", checkRoleAuth(), PackageController.getAllTiers);

export default packageRoutes;
