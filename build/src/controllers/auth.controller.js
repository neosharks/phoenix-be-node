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
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const user_service_1 = require("../services/user.service");
const jwt_core_1 = require("../core/jwt.core");
const helper_lib_1 = require("../lib/helper.lib");
const api_constant_1 = require("../constant/api.constant");
const auth_validator_1 = require("../validators/auth.validator");
const logger_core_1 = __importDefault(require("../core/logger.core"));
const email_core_1 = __importDefault(require("../core/email.core"));
const sms_core_1 = __importDefault(require("../core/sms.core"));
class _AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let body = req.body;
                const { isCreator } = req.body;
                const validation = auth_validator_1.registerSchema.validate(req.body);
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                const foundUser = yield user_service_1.UserService.getOneUser({ email: body.email });
                if (foundUser)
                    return res.status(403).json({ message: api_constant_1.errorMessage.USER_EXISTS });
                const saltRounds = 10;
                const salt = yield bcrypt_1.default.genSaltSync(saltRounds);
                const hash = yield bcrypt_1.default.hashSync(body.password, salt);
                if (body.referralUsername) {
                    const referralUser = yield user_service_1.UserService.getOneUser({ username: body.referralUsername });
                    if (referralUser) {
                        body.referralTimeStamp = new Date();
                        body.referralUsername = body.referralUsername;
                    }
                }
                body.password = hash;
                body.username = body.email.split("@")[0];
                body.language = body.language;
                body.theme = body.theme;
                const randomNum = (Math.random() * 20) | 1;
                const profileImage = `https://qalakar-public.s3.ap-south-1.amazonaws.com/avatars/${randomNum}.jpg`;
                const created = yield user_service_1.UserService.createOneUser(isCreator
                    ? Object.assign(Object.assign({}, body), { profileImage, isCreator: true, role: ["PATRON", "CREATOR"] }) : Object.assign(Object.assign({}, body), { profileImage }));
                if (body.email && body.email.length > 0) {
                    yield (0, email_core_1.default)(body.email, "Welcome to Qalakar!", "SIGNUP");
                }
                const accessToken = yield (0, jwt_core_1.signJwt)(created);
                return res.status(201).json({ messge: api_constant_1.successMessages.CREATED, accessToken, user: created });
            }
            catch (err) {
                console.log("Error in register", err);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: err });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const validation = auth_validator_1.loginSchema.validate(body);
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                const foundUser = yield user_service_1.UserService.getOneUser({ email: body.email });
                if (!foundUser)
                    return res.status(403).json({ message: api_constant_1.errorMessage.NOT_FOUND });
                let isMatch = false;
                if (foundUser.password)
                    isMatch = yield bcrypt_1.default.compareSync(body.password, foundUser.password);
                if (!foundUser.password)
                    return res.status(403).json({ message: api_constant_1.errorMessage.WRONG_AUTH_METHOD });
                if (!isMatch)
                    return res.status(403).json({ message: api_constant_1.errorMessage.INCORRECT_PASSWORD });
                const accessToken = yield (0, jwt_core_1.signJwt)(foundUser);
                return res
                    .status(200)
                    .json({ messge: api_constant_1.successMessages.SUCCESS, accessToken, user: foundUser });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { number, referralUsername } = req.body;
                if (!number)
                    return res.status(403).json({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const numberString = number.toString();
                const checkRes = numberString.includes("99999");
                let otpGenerated = Math.floor(Math.random() * 9000) + 1000;
                const commonProps = {
                    verificationCode: otpGenerated,
                    verificationCodeSource: "SMS",
                    verificationCodeTimestamp: new Date(),
                };
                if (checkRes) {
                    otpGenerated = 1111;
                    commonProps.verificationCode = otpGenerated;
                }
                else {
                    const smsRes = yield (0, sms_core_1.default)(number, otpGenerated);
                    if (!smsRes)
                        return res.status(400).json({ message: api_constant_1.errorMessage.SMS_ISSUE });
                }
                const foundUser = yield user_service_1.UserService.getOneUser({ phoneNumber: number });
                if (foundUser) {
                    //Fix this
                    const { verificationCodeTimestamp, verificationCodeAttempts } = foundUser;
                    if (verificationCodeTimestamp && verificationCodeAttempts > 1) {
                        const fiveMinutesAgo = new Date();
                        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
                        const dateVC = new Date(verificationCodeTimestamp);
                    }
                    yield user_service_1.UserService.updateOneUser({ phoneNumber: number }, Object.assign(Object.assign({}, commonProps), { verificationCodeAttempts: foundUser.verificationCodeAttempts + 1 }));
                }
                else {
                    if (referralUsername) {
                        const referralUser = yield user_service_1.UserService.getOneUser({ username: referralUsername });
                        if (referralUser) {
                            commonProps.referralTimeStamp = new Date();
                            commonProps.referralUserId = referralUser.id;
                            commonProps.language = referralUser.language;
                            commonProps.theme = referralUser.theme;
                        }
                    }
                    const username = (0, helper_lib_1.generateRandomUsername)();
                    const randomNum = (Math.random() * 20) | 1;
                    const profileImage = `https://qalakar-public.s3.ap-south-1.amazonaws.com/avatars/${randomNum}.jpg`;
                    yield user_service_1.UserService.createOneUser(Object.assign({ username, phoneNumber: number, profileImage, verificationCodeAttempts: 1 }, commonProps));
                }
                return res.status(200).json({ message: api_constant_1.successMessages.SUCCESS });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { number } = req.body;
                const validation = auth_validator_1.sendOtpSchema.validate({ number });
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                if (!number)
                    return res.status(403).json({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundUser = yield user_service_1.UserService.getOneUser({ phoneNumber: number });
                if (!foundUser)
                    return res.status(400).json({ message: api_constant_1.errorMessage.USER_NOT_FOUND });
                const { verificationCodeTimestamp, verificationCodeAttempts } = foundUser;
                if (verificationCodeTimestamp && verificationCodeAttempts > 1) {
                    const fiveMinutesAgo = new Date();
                    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
                    const dateVC = new Date(verificationCodeTimestamp);
                    if (dateVC < fiveMinutesAgo)
                        return res
                            .status(400)
                            .json({ message: api_constant_1.errorMessage.NOT_ALLOWED, verificationCodeTimestamp });
                }
                let otpGenerated = Math.floor(Math.random() * 9000) + 1000;
                const smsRes = yield (0, sms_core_1.default)(number, otpGenerated);
                if (!smsRes)
                    return res.status(400).json({ message: api_constant_1.errorMessage.SMS_ISSUE });
                const commonProps = {
                    verificationCode: otpGenerated,
                    verificationCodeSource: "SMS",
                    verificationCodeTimestamp: new Date(),
                    verificationCodeAttempts: verificationCodeAttempts + 1,
                };
                if (foundUser)
                    yield user_service_1.UserService.updateOneUser({ id: foundUser.id }, Object.assign({}, commonProps));
                return res.status(200).json({ message: api_constant_1.successMessages.SUCCESS });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const { error } = auth_validator_1.forgetPasswordSchema.validate({ email });
                if (error) {
                    return res.status(400).json({ error: error.details[0].message });
                }
                if (!email)
                    return res.status(403).json({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundUser = yield user_service_1.UserService.getOneUser({ email });
                if (!foundUser)
                    return res.status(404).json({ message: api_constant_1.errorMessage.NOT_FOUND });
                const code = (0, helper_lib_1.generateOtp)();
                yield user_service_1.UserService.updateOneUser({ email }, {
                    verificationCode: code,
                    verificationCodeSource: "EMAIL",
                });
                yield (0, email_core_1.default)(email, `OTP to Reset your password | ${foundUser.username}`, "FORGET_PASSWORD", {
                    code,
                    name: `${foundUser.username}`,
                });
                return res.status(200).json({ message: api_constant_1.successMessages.SUCCESS, email });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    requestEmailOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const validation = auth_validator_1.forgetPasswordSchema.validate(email);
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                if (!email)
                    return res.status(403).json({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundUser = yield user_service_1.UserService.getOneUser({ email });
                if (!foundUser)
                    return res.status(404).json({ message: api_constant_1.errorMessage.NOT_FOUND });
                const code = (0, helper_lib_1.generateOtp)();
                yield user_service_1.UserService.updateOneUser({ email }, {
                    verificationCode: code,
                    verificationCodeSource: "EMAIL",
                });
                yield (0, email_core_1.default)(email, `OTP to Reset your password | ${foundUser.username}`, "FORGET_PASSWORD", {
                    code,
                    name: `${foundUser.username}`,
                });
                return res.status(200).json({ message: api_constant_1.successMessages.SUCCESS, email });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    verifyForgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, code, password } = req.body;
                console.log(email, code, password);
                const validation = auth_validator_1.verifyForgetPasswordSchema.validate({ email, code, password });
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                if (!email || !code || !password)
                    return res.status(403).json({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundUser = yield user_service_1.UserService.getOneUser({ email });
                if (!foundUser)
                    return res.status(404).json({ message: api_constant_1.errorMessage.NOT_FOUND });
                if (parseInt(foundUser.verificationCode) !== parseInt(code))
                    return res.status(403).json({ message: api_constant_1.errorMessage.INCORRECT_DATA });
                const saltRounds = 10;
                const salt = yield bcrypt_1.default.genSaltSync(saltRounds);
                const hash = yield bcrypt_1.default.hashSync(password, salt);
                yield user_service_1.UserService.updateOneUser({ email }, {
                    password: hash,
                    verificationCode: null,
                    verificationCodeSource: null,
                    verificationCodeTimestamp: null,
                });
                return res.status(200).json({ message: "UPDATED" });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldPassword, newPassword } = req.body;
                const validation = auth_validator_1.resetPasswordSchema.validate({ oldPassword, newPassword });
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                const { password, id } = res.locals.user;
                if (!oldPassword || !newPassword)
                    return res.status(400).json({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                if (!password)
                    return res.status(403).json({ message: api_constant_1.errorMessage.WRONG_AUTH_METHOD });
                let isMatch = false;
                isMatch = yield bcrypt_1.default.compareSync(oldPassword, password);
                if (!isMatch)
                    return res.status(403).json({ message: api_constant_1.errorMessage.INCORRECT_PASSWORD });
                const saltRounds = 10;
                const salt = yield bcrypt_1.default.genSaltSync(saltRounds);
                const hash = yield bcrypt_1.default.hashSync(newPassword, salt);
                yield user_service_1.UserService.updateOneUser({ id }, { password: hash });
                const accessToken = yield (0, jwt_core_1.signJwt)(res.locals.user);
                return res.status(200).json({ message: api_constant_1.successMessages.SUCCESS, accessToken });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    loginViaNumber(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { number, otp } = req.body;
                const validation = auth_validator_1.loginViaNumberSchema.validate({ number, otp });
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                if (!number || !otp)
                    res.status(403).json({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundUser = yield user_service_1.UserService.getOneUser({ phoneNumber: number });
                if (!foundUser)
                    return res.status(403).json({ message: api_constant_1.errorMessage.NOT_FOUND });
                let isMatch = false;
                if (!foundUser.verificationCode)
                    return res.status(403).json({ message: api_constant_1.errorMessage.FLOW_ERROR });
                if (foundUser.verificationCode)
                    isMatch = parseInt(otp) === foundUser.verificationCode;
                if (!isMatch)
                    return res.status(403).json({ message: api_constant_1.errorMessage.INCORRECT_DATA });
                let createdUser = {};
                const commonProps = {
                    verificationCode: null,
                    verificationCodeSource: null,
                    verificationCodeTimestamp: null,
                };
                if (!foundUser.phoneVerified) {
                    createdUser = yield user_service_1.UserService.updateOneUser({ phoneNumber: number }, Object.assign({ phoneVerified: true }, commonProps));
                }
                else
                    createdUser = yield user_service_1.UserService.updateOneUser({ phoneNumber: number }, Object.assign({}, commonProps));
                const accessToken = yield (0, jwt_core_1.signJwt)(createdUser);
                return res
                    .status(201)
                    .json({ messge: api_constant_1.successMessages.SUCCESS, accessToken, user: createdUser });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { googleAccessToken } = req.body;
                if (!googleAccessToken)
                    return res.status(403).json({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const FetchResponse = yield axios_1.default.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${googleAccessToken}`,
                    },
                });
                const { email, picture, family_name, given_name, sub, language, theme } = FetchResponse.data;
                let foundUser = yield user_service_1.UserService.getOneUser({ email });
                if (!foundUser) {
                    const randomNum = (Math.random() * 25) | 1;
                    const profileImage = `https://phoenix-test-bucket9415.s3.ap-south-1.amazonaws.com/avatars/avatar_${randomNum}.jpg`;
                    const user = {
                        googleAuthId: sub,
                        email: email,
                        firstName: given_name,
                        lastName: family_name,
                        profileImage: picture ? picture : profileImage,
                        username: email.split("@")[0],
                        language: language,
                        theme: theme,
                        emailVerified: true,
                    };
                    foundUser = yield user_service_1.UserService.createOneUser(user);
                    if (email && email.length > 0) {
                        logger_core_1.default.info("sending email to: ", email);
                        yield (0, email_core_1.default)(email, "Welcome to Qalakar!", "SIGNUP", {
                            firstName: given_name,
                            lastName: family_name,
                        });
                    }
                }
                else {
                    yield user_service_1.UserService.updateOneUser({ email: email }, { googleAuthId: sub, emailVerified: true });
                }
                const token = yield (0, jwt_core_1.signJwt)(foundUser);
                return res
                    .status(200)
                    .json({ message: api_constant_1.successMessages.SUCCESS, accessToken: token, user: foundUser });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).json({ message: api_constant_1.successMessages.SUCCESS });
        });
    }
}
exports.AuthController = new _AuthController();
