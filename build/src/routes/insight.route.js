"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const insight_controller_1 = require("../controllers/insight.controller");
const insightRoutes = express_1.default.Router();
insightRoutes.get("/get", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), insight_controller_1.InsightController.get);
exports.default = insightRoutes;
