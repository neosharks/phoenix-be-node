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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightController = void 0;
const api_constant_1 = require("../constant/api.constant");
const logger_core_1 = __importDefault(require("../core/logger.core"));
const insights_service_1 = require("../services/insights.service");
class _InsightController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, isCreator } = res.locals.user;
                if (!isCreator)
                    return res.status(api_constant_1.errorCode.FORBIDDEN).json({ message: api_constant_1.errorMessage.NOT_ALLOWED });
                const d = new Date().getMonth() - 6;
                const result = yield insights_service_1.InsightService.getAllPackagesOfCreator({
                    creatorId: id,
                });
                let obj = {};
                result === null || result === void 0 ? void 0 : result.forEach((e) => {
                    let date = new Date(e.createdAt);
                    const monthName = date.toLocaleString("en-US", { month: "long" });
                    if (obj[monthName]) {
                        obj[monthName].push(e);
                    }
                    else {
                        obj[monthName] = new Array(e);
                    }
                });
                return res.status(200).send({ message: api_constant_1.successMessages.FETCHED, data: obj });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
}
exports.InsightController = new _InsightController();
