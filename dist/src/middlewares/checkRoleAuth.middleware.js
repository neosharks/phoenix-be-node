"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRoleAuth = void 0;
const lodash_1 = require("lodash");
const jwt_core_1 = require("../core/jwt.core");
const user_service_1 = require("../services/user.service");
const api_constant_1 = require("../constant/api.constant");
const checkRoleAuth = (requiredRoles = ["PATRON"]) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const accessToken = (0, lodash_1.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
        if (!accessToken)
            return res.status(403).json({ message: api_constant_1.errorMessage.TOKEN_MISSING });
        const { decoded } = (0, jwt_core_1.verifyJwt)(accessToken);
        if (decoded) {
            const { id } = decoded;
            const foundUser = yield user_service_1.UserService.getOneUser({ id });
            if (!foundUser)
                return res.status(403).json({ message: api_constant_1.errorMessage.UNAUTHORISED });
            if (foundUser.status !== "ACTIVE")
                return res.status(403).json({ message: api_constant_1.errorMessage.USER_BLOCKED });
            res.locals.user = foundUser;
            const userRoles = (foundUser === null || foundUser === void 0 ? void 0 : foundUser.role) || [];
            let hasRequiredRole = false;
            requiredRoles.forEach((requiredRole) => {
                if (userRoles.includes(requiredRole))
                    hasRequiredRole = true;
            });
            if (hasRequiredRole) {
                return next();
            }
            else {
                return res.status(403).json({ message: api_constant_1.errorCode.UNAUTHORISED });
            }
        }
        else {
            return res.sendStatus(403);
        }
    });
};
exports.checkRoleAuth = checkRoleAuth;
