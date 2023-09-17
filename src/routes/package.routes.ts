import express from "express";
import { PackageController } from "../controllers/package.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";

const packageRoutes = express.Router();

packageRoutes.post(
  "/createOnePackage",
  checkRoleAuth(["ADMIN"]),
  PackageController.createOnePackage,
);

packageRoutes.get("/getPackageByUser", checkRoleAuth(), PackageController.getPackageByUser);

packageRoutes.get("/getPackage", checkRoleAuth(), PackageController.getPackage);

packageRoutes.post("/buyPackage", checkRoleAuth(), PackageController.buyPackage);

//-------------------

packageRoutes.post("/createOneTier", checkRoleAuth(["ADMIN"]), PackageController.createOneTier);

packageRoutes.get("/getAllTier", checkRoleAuth(), PackageController.getAllTier);

export default packageRoutes;
