import passport from "passport";
import passportGoogle from "passport-google-oauth20";
//----------------------------------
import { UserService } from "../services/user.service";
//----------------------------------
import config from "../../config";
import logger from "../core/logger.core";

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: config.passport.googleClientId,
      clientSecret: config.passport.googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken: any, refreshToken: any, profile: any, cb: any) {
      const email = profile?.emails[0]?.value;
      const foundUser = await UserService.getOneUser({ email });
      if (foundUser) cb(null, foundUser);
      if (!foundUser) {
        const randomNum = (Math.random() * 25) | 1;
        const profileImage = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${randomNum}.jpg`;
        const user = {
          googleAuthId: profile?.id,
          email: profile?.emails[0]?.value,
          firstName: profile?.name?.givenName,
          lastName: profile?.name?.familyName,
          profileImage: profile?.photos[0]?.value ? profile?.photos[0]?.value : profileImage,
          username: profile?.emails[0]?.value,
          emailVerified: true,
        };
        const createdUser = await UserService.createOneUser(user);
        cb(null, createdUser);
      }
      if (!foundUser?.googleAuthId)
        await UserService.updateOneUser(
          { email: email },
          { googleAuthId: profile?.id, emailVerified: true },
        );
      cb(null);
    },
  ),
);

passport.serializeUser((user: any, done: any) => {
  return done(null, user._id);
});
