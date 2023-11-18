"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const common_controller_1 = require("../controllers/common.controller");
const commonRoutes = express_1.default.Router();
commonRoutes.get("/getS3SignedUrl", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), common_controller_1.CommonController.getS3SignedUrl);
exports.default = commonRoutes;
