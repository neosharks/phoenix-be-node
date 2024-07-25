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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassController = void 0;
const api_constant_1 = require("../constant/api.constant");
const class_service_1 = require("../services/class.service");
const s3upload_core_1 = require("../core/s3upload.core");
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
                if (!allClasses) {
                    return res.status(200).send({ message: api_constant_1.successMessages.FETCHED, data: [] });
                }
                yield Promise.all(allClasses.map((getClass) => __awaiter(this, void 0, void 0, function* () {
                    if (getClass.creator.profileImage) {
                        getClass.creator.profileImage = yield (0, s3upload_core_1.getObjectSignedUrl)(getClass.creator.profileImage);
                    }
                    return getClass;
                })));
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
    updateClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { id } = _a, data = __rest(_a, ["id"]);
                if (!id) {
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                }
                const foundClass = yield class_service_1.ClassService.getOneClassByProps({ id: parseInt(id) });
                if (!foundClass) {
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                }
                yield class_service_1.ClassService.updateClassByProps({ id: parseInt(id) }, data);
                return res.status(200).send({ message: api_constant_1.successMessages.UPDATED });
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
    addMultipleParticipants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { classId, participants } = req.body;
                if (!classId || !participants || !Array.isArray(participants)) {
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                }
                const participantData = participants.map((participantId) => ({
                    userId: participantId,
                    classId: classId,
                }));
                yield class_service_1.ClassService.addMultipleParticipants(participantData);
                return res.status(200).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error });
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
            var _a, _b, _c;
            try {
                const { classId, participantId, message, isPinned = false } = req.body;
                const files = req.files;
                const image = (_a = files === null || files === void 0 ? void 0 : files.image) === null || _a === void 0 ? void 0 : _a[0];
                const video = (_b = files === null || files === void 0 ? void 0 : files.video) === null || _b === void 0 ? void 0 : _b[0];
                const document = (_c = files === null || files === void 0 ? void 0 : files.document) === null || _c === void 0 ? void 0 : _c[0];
                const { id } = res.locals.user;
                const payload = { authorId: id };
                if (!classId || !participantId || (!message && !image && !video && !document)) {
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                }
                if (image)
                    payload.image = yield (0, s3upload_core_1.GetUploadedFile)(image);
                if (video)
                    payload.video = yield (0, s3upload_core_1.GetUploadedVideo)(video);
                if (document)
                    payload.document = yield (0, s3upload_core_1.GetUploadedDocument)(document);
                if (!message && !payload.image && !payload.video && !payload.document) {
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                }
                // if (isPinned) payload.isPinned = isPinned;
                const created = yield class_service_1.ClassService.addMessage(Object.assign(Object.assign({}, payload), { userId: Number(participantId), classId: Number(classId), message: message || "", isPinned: false }));
                if (created === null || created === void 0 ? void 0 : created.image)
                    created.image = yield (0, s3upload_core_1.getObjectSignedUrl)(created.image);
                if (created === null || created === void 0 ? void 0 : created.video)
                    created.video = yield (0, s3upload_core_1.getObjectSignedUrl)(created.video);
                if (created === null || created === void 0 ? void 0 : created.document)
                    created.document = yield (0, s3upload_core_1.getObjectSignedUrl)(created.document);
                return res.status(200).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                console.error("Error sending message:", error);
                return res.status(500).json({ error: "Internal server error" });
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
                if (!allClasses) {
                    return res.status(200).send({ message: api_constant_1.successMessages.FETCHED, data: [] });
                }
                yield Promise.all(allClasses.map((message) => __awaiter(this, void 0, void 0, function* () {
                    if (message.image) {
                        message.image = yield (0, s3upload_core_1.getObjectSignedUrl)(message.image);
                    }
                    if (message.video) {
                        message.video = yield (0, s3upload_core_1.getObjectSignedUrl)(message.video);
                    }
                    if (message.document) {
                        message.document = yield (0, s3upload_core_1.getObjectSignedUrl)(message.document);
                    }
                    return message;
                })));
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
    updateSendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { classId, messageId, isPinned = false } = req.body;
                console.log(classId, messageId, isPinned, ">>>>>>>");
                if (!classId || !messageId)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundClass = yield class_service_1.ClassService.getAllMessagesOfClass(parseInt(classId));
                const findMessage = foundClass === null || foundClass === void 0 ? void 0 : foundClass.find((res) => res.id === messageId);
                if (!findMessage)
                    return res.status(api_constant_1.errorCode.GENERIC).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                yield class_service_1.ClassService.updateSendMessage({ id: messageId }, { isPinned });
                return res.status(200).send({ message: api_constant_1.successMessages.UPDATED });
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
