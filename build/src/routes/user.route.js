"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const role_constant_1 = require("../constant/role.constant");
const userRoutes = express_1.default.Router();
// -----------  GET ----------------
userRoutes.get("/get", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.getUser);
userRoutes.get("/getAllLinks/:username", user_controller_1.UserController.getAllLinks);
userRoutes.get("/getByUsername/:username", user_controller_1.UserController.getUserByUsername);
userRoutes.get("/getAllCreators", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.getAllCreator);
userRoutes.get("/allUser", user_controller_1.UserController.getAllTotalUser);
// -----------  POST ----------------
userRoutes.post("/createLink", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.CREATOR]), user_controller_1.UserController.createLink);
userRoutes.post("/creatorOnboard", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.creatorOnboard);
userRoutes.post("/approveCreatorOnboard", user_controller_1.UserController.approveCreatorOnboard);
userRoutes.post("/update", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.update);
userRoutes.post("/updateCoverImage", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.updateCoverImage);
userRoutes.post("/updateProfileImage", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.updateProfileImage);
userRoutes.post("/joinForFree", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.joinForFree);
userRoutes.delete("/delete", user_controller_1.UserController.delete);
exports.default = userRoutes;
