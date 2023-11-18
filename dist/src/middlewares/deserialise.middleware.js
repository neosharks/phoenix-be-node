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
exports.deserializeUserOnRequest = void 0;
const lodash_1 = require("lodash");
const jwt_core_1 = require("../core/jwt.core");
const journey_service_1 = require("../services/journey.service");
const deserializeUserOnRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (0, lodash_1.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    if (!accessToken)
        return next();
    const { decoded } = (0, jwt_core_1.verifyJwt)(accessToken);
    if (decoded) {
        res.locals.user = decoded;
        yield journey_service_1.JourneyService.createJourney({
            userId: decoded.id,
            path: req.originalUrl,
            method: req.method,
        });
        return next();
    }
    return next();
});
exports.deserializeUserOnRequest = deserializeUserOnRequest;
