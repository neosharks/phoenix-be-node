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
exports.ClassController = void 0;
const api_constant_1 = require("../constant/api.constant");
const class_service_1 = require("../services/class.service");
class _ClassController {
    getOneClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                if (!id)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundClass = yield class_service_1.ClassService.getOneClassByProps({ id: parseInt(id) });
                return res.status(200).send({ message: api_constant_1.successMessages.FETCHED, data: foundClass });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllClasses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { creatorId } = req.query;
                if (!creatorId)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const allClasses = yield class_service_1.ClassService.getAllClassesByCreatorId(creatorId);
                return res.status(200).send({ message: api_constant_1.successMessages.FETCHED, data: allClasses });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    createClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = res.locals.user;
                const { name, isPaid = false } = req.body;
                if (!name)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                yield class_service_1.ClassService.createClass({ name, creatorId: id, isPaid, type: "NORMAL" });
                return res.status(200).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    addOneParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { classId, participantId } = req.body;
                if (!classId || !participantId)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                yield class_service_1.ClassService.addClassParticipant({ userId: participantId, classId });
                return res.status(200).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllParticipantOfClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { classId } = req.query;
                if (!classId)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const allClasses = yield class_service_1.ClassService.getAllParticipantOfClass(parseInt(classId));
                return res.status(200).send({ message: api_constant_1.successMessages.FETCHED, data: allClasses });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { classId, participantId, message, isPinned = false } = req.body;
                if (!classId || !participantId || !message)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                yield class_service_1.ClassService.addMessage({ userId: participantId, classId, message, isPinned });
                return res.status(200).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllMessagesOfClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                if (!id)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const allClasses = yield class_service_1.ClassService.getAllMessagesOfClass(parseInt(id));
                return res.status(200).send({ message: api_constant_1.successMessages.FETCHED, data: allClasses });
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
exports.ClassController = new _ClassController();
