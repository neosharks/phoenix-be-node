"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const userRoutes = express_1.default.Router();
userRoutes.get("/get", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.getUser);
userRoutes.get("/getByUsername/:username", user_controller_1.UserController.getUserByUsername);
userRoutes.get("/getAllCreators", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.getAllCreator);
userRoutes.post("/creatorOnboard", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), user_controller_1.UserController.creatorOnboard);
exports.default = userRoutes;
