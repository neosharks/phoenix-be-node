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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
//----------------------------------
const user_service_1 = require("../services/user.service");
//----------------------------------
const config_1 = __importDefault(require("../../config"));
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: config_1.default.passport.googleClientId,
    clientSecret: config_1.default.passport.googleClientSecret,
    callbackURL: "/auth/google/callback",
}, function (accessToken, refreshToken, profile, cb) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        const email = (_a = profile === null || profile === void 0 ? void 0 : profile.emails[0]) === null || _a === void 0 ? void 0 : _a.value;
        const foundUser = yield user_service_1.UserService.getOneUser({ email });
        if (foundUser)
            cb(null, foundUser);
        if (!foundUser) {
            const randomNum = (Math.random() * 25) | 1;
            const profileImage = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${randomNum}.jpg`;
            const user = {
                googleAuthId: profile === null || profile === void 0 ? void 0 : profile.id,
                email: (_b = profile === null || profile === void 0 ? void 0 : profile.emails[0]) === null || _b === void 0 ? void 0 : _b.value,
                firstName: (_c = profile === null || profile === void 0 ? void 0 : profile.name) === null || _c === void 0 ? void 0 : _c.givenName,
                lastName: (_d = profile === null || profile === void 0 ? void 0 : profile.name) === null || _d === void 0 ? void 0 : _d.familyName,
                profileImage: ((_e = profile === null || profile === void 0 ? void 0 : profile.photos[0]) === null || _e === void 0 ? void 0 : _e.value) ? (_f = profile === null || profile === void 0 ? void 0 : profile.photos[0]) === null || _f === void 0 ? void 0 : _f.value : profileImage,
                username: (_g = profile === null || profile === void 0 ? void 0 : profile.emails[0]) === null || _g === void 0 ? void 0 : _g.value,
                emailVerified: true,
            };
            const createdUser = yield user_service_1.UserService.createOneUser(user);
            cb(null, createdUser);
        }
        if (!(foundUser === null || foundUser === void 0 ? void 0 : foundUser.googleAuthId))
            yield user_service_1.UserService.updateOneUser({ email: email }, { googleAuthId: profile === null || profile === void 0 ? void 0 : profile.id, emailVerified: true });
        cb(null);
    });
}));
passport_1.default.serializeUser((user, done) => {
    return done(null, user._id);
});
