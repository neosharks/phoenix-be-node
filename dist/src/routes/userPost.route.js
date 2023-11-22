"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//------------------------
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const role_constant_1 = require("../constant/role.constant");
const userPost_controller_1 = require("../controllers/userPost.controller");
const userPostRoutes = express_1.default.Router();
userPostRoutes.post("/createUserPost", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.CREATOR]), userPost_controller_1.UserPostController.createOneUserPost);
userPostRoutes.post("/commentOnPostByUser", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), userPost_controller_1.UserPostController.commentOnPostByUser);
userPostRoutes.post("/likePostToggle", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), userPost_controller_1.UserPostController.likePostToggle);
userPostRoutes.get("/getAllPostForUser", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), userPost_controller_1.UserPostController.getAllPostForUser);
userPostRoutes.get("/getAllUserPostByUser", userPost_controller_1.UserPostController.getAllUserPostByUser);
userPostRoutes.get("/getOneUserPost", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), userPost_controller_1.UserPostController.getOneUserPost);
exports.default = userPostRoutes;
