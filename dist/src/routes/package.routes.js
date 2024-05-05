"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const package_controller_1 = require("../controllers/package.controller");
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const role_constant_1 = require("../constant/role.constant");
const packageRoutes = express_1.default.Router();
packageRoutes.post("/createOnePackage", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.CREATOR]), package_controller_1.PackageController.createOnePackage);
packageRoutes.post("/updatePackage", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.CREATOR]), package_controller_1.PackageController.updatePackage);
packageRoutes.get("/getAllPackagesOfCreator/:username", package_controller_1.PackageController.getAllPackagesOfCreator);
packageRoutes.get("/getOnePackage", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), package_controller_1.PackageController.getOnePackage);
packageRoutes.get("/getPackageNames", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.CREATOR]), package_controller_1.PackageController.getPackageNames);
packageRoutes.get("/getAllSubscriptions/:username", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), package_controller_1.PackageController.useGetAllSubscriptions);
packageRoutes.get("/getAllPatronsByCreator/:username", package_controller_1.PackageController.getAllPatronsByCreator);
packageRoutes.post("/buyPackage", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), package_controller_1.PackageController.buyPackage);
//-------------------
packageRoutes.post("/createOneTier", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.ADMIN]), package_controller_1.PackageController.createOneTier);
packageRoutes.post("/createManyTier", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.ADMIN]), package_controller_1.PackageController.createManyTier);
packageRoutes.get("/getAllTiers", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), package_controller_1.PackageController.getAllTiers);
exports.default = packageRoutes;
