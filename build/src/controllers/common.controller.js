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
exports.CommonController = void 0;
const api_constant_1 = require("../constant/api.constant");
const common_service_1 = require("../services/common.service");
const user_service_1 = require("../services/user.service");
class _CommonController {
    getS3SignedUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS });
        });
    }
    clickStream(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ip = req.ip;
                const { userId, type, info } = req.body;
                const payload = { type, info, ipAddress: ip };
                if (userId) {
                    const foundUser = yield user_service_1.UserService.getOneUser({ id: userId });
                    if (!foundUser)
                        return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.USER_NOT_FOUND });
                    payload.userId = userId;
                }
                yield common_service_1.CommonService.createClickStream(payload);
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
}
exports.CommonController = new _CommonController();
