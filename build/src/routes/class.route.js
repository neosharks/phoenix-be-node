"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const role_constant_1 = require("../constant/role.constant");
const class_controller_1 = require("../controllers/class.controller");
const classRoutes = express_1.default.Router();
classRoutes.get("/getAllClasses", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.getAllClasses);
classRoutes.get("/getOneClass", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.getOneClass);
classRoutes.get("/getAllParticipantOfClass", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.getAllParticipantOfClass);
classRoutes.get("/getAllMessagesOfClass", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.getAllMessagesOfClass);
classRoutes.get("/getAvailableParticipants", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.getAvailableParticipants);
classRoutes.get("/getAllClassesForUser", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.getAllClassesForUser);
// -----------  POST ----------------
classRoutes.post("/updateClass", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.updateClass);
classRoutes.post("/create", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.CREATOR]), class_controller_1.ClassController.createClass);
classRoutes.post("/addOneParticipant", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.addOneParticipant);
classRoutes.post("/addMultipleParticipants", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.CREATOR]), class_controller_1.ClassController.addMultipleParticipants);
classRoutes.post("/sendMessage", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.sendMessage);
classRoutes.post("/deleteOneMessage", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.deleteOneMessage);
classRoutes.post("/updateMessage", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.updateMessage);
classRoutes.post("/leaveOneClass", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.leaveOneClass);
classRoutes.post("/requestClass", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), class_controller_1.ClassController.requestNewClass);
classRoutes.post("/deactivateOneClass", (0, checkRoleAuth_middleware_1.checkRoleAuth)([role_constant_1.userRole.CREATOR]), class_controller_1.ClassController.deactivateOneClass);
exports.default = classRoutes;
