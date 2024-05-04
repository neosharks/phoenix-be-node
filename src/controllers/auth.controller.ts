import { Request, Response } from "express";
import bcrypt from "bcrypt";
import axios from "axios";
import { UserService } from "../services/user.service";
import { signJwt } from "../core/jwt.core";
import { generateOtp, generateRandomUsername } from "../lib/helper.lib";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";
import sendEmail from "../core/email.core";
import sendOtpSms from "../core/sms.core";

class _AuthController {
  async register(req: Request, res: Response) {
    try {
      let body = req.body;
      const { isCreator } = req.body;
      const foundUser = await UserService.getOneUser({ email: body.email });
      if (foundUser)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.USER_EXISTS });
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hash = await bcrypt.hashSync(body.password, salt);
      if (body.referralUsername) {
        const referralUser = await UserService.getOneUser({ username: body.referralUsername });
        if (referralUser) {
          body.referralTimeStamp = new Date();
          body.referralUsername = body.referralUsername;
        }
      }
      body.password = hash;
      body.username = body.email.split("@")[0];
      const randomNum = (Math.random() * 25) | 1;
      const profileImage = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${randomNum}.jpg`;
      const created = await UserService.createOneUser(
        isCreator
          ? { ...body, profileImage, isCreator: true, role: ["PATRON", "CREATOR"] }
          : { ...body, profileImage },
      );
      if (body.email && body.email.length > 0) {
        await sendEmail(body.email, "Welcome to Quiber!", "SIGNUP", {
          firstName: body.firstName,
          lastName: body.lastName,
        });
      }
      const accessToken = await signJwt(created);
      return res.status(201).json({ messge: successMessages.CREATED, accessToken, user: created });
    } catch (err) {
      console.log("Error in register", err);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: err });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const body = req.body;
      const foundUser = await UserService.getOneUser({ email: body.email });
      if (!foundUser) return res.status(403).json({ message: errorMessage.NOT_FOUND });
      // if (foundUser.status !== "ACTIVE")
      //   return res.status(403).json({ message: errorMessage.USER_BLOCKED });
      let isMatch = false;
      if (foundUser.password) isMatch = await bcrypt.compareSync(body.password, foundUser.password);
      if (!foundUser.password)
        return res.status(403).json({ message: errorMessage.WRONG_AUTH_METHOD });
      if (!isMatch) return res.status(403).json({ message: errorMessage.INCORRECT_PASSWORD });
      const accessToken = await signJwt(foundUser);
      return res
        .status(200)
        .json({ messge: successMessages.SUCCESS, accessToken, user: foundUser });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async sendOtp(req: Request, res: Response) {
    try {
      const { number, referralUsername } = req.body;
      if (!number)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.MISSING_PARAMS });
      const numberString = number.toString();
      const checkRes = numberString.includes("99999");
      let otpGenerated = Math.floor(Math.random() * 9000) + 1000;
      const commonProps: any = {
        verificationCode: otpGenerated,
        verificationCodeSource: "SMS",
        verificationCodeTimestamp: new Date(),
      };
      if (checkRes) {
        otpGenerated = 1111;
        commonProps.verificationCode = otpGenerated;
      } else {
        const smsRes = await sendOtpSms(number, otpGenerated);
        if (!smsRes) return res.status(errorCode.GENERIC).json({ message: errorMessage.SMS_ISSUE });
      }
      const foundUser = await UserService.getOneUser({ phoneNumber: number });
      if (foundUser) {
        //Fix this
        const { verificationCodeTimestamp, verificationCodeAttempts } = foundUser;
        if (verificationCodeTimestamp && verificationCodeAttempts > 1) {
          const fiveMinutesAgo = new Date();
          fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
          const dateVC = new Date(verificationCodeTimestamp);
          // if (dateVC < fiveMinutesAgo)
          //   return res
          //     .status(errorCode.GENERIC)
          //     .json({ message: errorMessage.NOT_ALLOWED, verificationCodeTimestamp });
        }
        await UserService.updateOneUser(
          { phoneNumber: number },
          { ...commonProps, verificationCodeAttempts: foundUser.verificationCodeAttempts + 1 },
        );
      } else {
        if (referralUsername) {
          const referralUser = await UserService.getOneUser({ username: referralUsername });
          if (referralUser) {
            commonProps.referralTimeStamp = new Date();
            commonProps.referralUserId = referralUser.id;
          }
        }
        const username = generateRandomUsername();
        const randomNum = (Math.random() * 25) | 1;
        const profileImage = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${randomNum}.jpg`;
        await UserService.createOneUser({
          username,
          phoneNumber: number,
          profileImage,
          verificationCodeAttempts: 1,
          ...commonProps,
        });
      }
      return res.status(200).json({ message: successMessages.SUCCESS });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { number } = req.body;
      if (!number)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.MISSING_PARAMS });
      const foundUser = await UserService.getOneUser({ phoneNumber: number });
      if (!foundUser)
        return res.status(errorCode.GENERIC).json({ message: errorMessage.USER_NOT_FOUND });
      const { verificationCodeTimestamp, verificationCodeAttempts } = foundUser;
      if (verificationCodeTimestamp && verificationCodeAttempts > 1) {
        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
        const dateVC = new Date(verificationCodeTimestamp);
        if (dateVC < fiveMinutesAgo)
          return res
            .status(errorCode.GENERIC)
            .json({ message: errorMessage.NOT_ALLOWED, verificationCodeTimestamp });
      }
      let otpGenerated = Math.floor(Math.random() * 9000) + 1000;
      const smsRes = await sendOtpSms(number, otpGenerated);
      if (!smsRes) return res.status(errorCode.GENERIC).json({ message: errorMessage.SMS_ISSUE });
      const commonProps: any = {
        verificationCode: otpGenerated,
        verificationCodeSource: "SMS",
        verificationCodeTimestamp: new Date(),
        verificationCodeAttempts: verificationCodeAttempts + 1,
      };
      if (foundUser) await UserService.updateOneUser({ id: foundUser.id }, { ...commonProps });
      return res.status(200).json({ message: successMessages.SUCCESS });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async forgetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.MISSING_PARAMS });
      const foundUser = await UserService.getOneUser({ email });
      if (!foundUser)
        return res.status(errorCode.NOT_FOUND).json({ message: errorMessage.NOT_FOUND });
      const code = generateOtp();
      await UserService.updateOneUser(
        { email },
        {
          verificationCode: code,
          verificationCodeSource: "EMAIL",
        },
      );
      await sendEmail(
        email,
        `OTP to Reset your password | ${foundUser.username}`,
        "FORGET_PASSWORD",
        {
          code,
          name: `${foundUser.username}`,
        },
      );
      return res.status(200).json({ message: successMessages.SUCCESS, email });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async requestEmailOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.MISSING_PARAMS });
      const foundUser = await UserService.getOneUser({ email });
      if (!foundUser)
        return res.status(errorCode.NOT_FOUND).json({ message: errorMessage.NOT_FOUND });
      const code = generateOtp();
      await UserService.updateOneUser(
        { email },
        {
          verificationCode: code,
          verificationCodeSource: "EMAIL",
        },
      );
      await sendEmail(
        email,
        `OTP to Reset your password | ${foundUser.username}`,
        "FORGET_PASSWORD",
        {
          code,
          name: `${foundUser.username}`,
        },
      );
      return res.status(200).json({ message: successMessages.SUCCESS, email });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async verifyForgetPassword(req: Request, res: Response) {
    try {
      const { email, code, password } = req.body;
      console.log(email, code, password);
      if (!email || !code || !password)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.MISSING_PARAMS });
      const foundUser: any = await UserService.getOneUser({ email });
      if (!foundUser)
        return res.status(errorCode.NOT_FOUND).json({ message: errorMessage.NOT_FOUND });
      if (parseInt(foundUser.verificationCode) !== parseInt(code))
        return res.status(errorCode.UNAUTHORISED).json({ message: errorMessage.INCORRECT_DATA });
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hash = await bcrypt.hashSync(password, salt);
      await UserService.updateOneUser(
        { email },
        {
          password: hash,
          verificationCode: null,
          verificationCodeSource: null,
          verificationCodeTimestamp: null,
        },
      );
      return res.status(200).json({ message: successMessages.UPDATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;
      const { password, id } = res.locals.user;
      if (!oldPassword || !newPassword)
        return res.status(errorCode.GENERIC).json({ message: errorMessage.MISSING_PARAMS });
      if (!password) return res.status(403).json({ message: errorMessage.WRONG_AUTH_METHOD });
      let isMatch = false;
      isMatch = await bcrypt.compareSync(oldPassword, password);
      if (!isMatch) return res.status(403).json({ message: errorMessage.INCORRECT_PASSWORD });
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hash = await bcrypt.hashSync(newPassword, salt);
      await UserService.updateOneUser({ id }, { password: hash });
      const accessToken = await signJwt(res.locals.user);
      return res.status(200).json({ message: successMessages.SUCCESS, accessToken });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async loginViaNumber(req: Request, res: Response) {
    try {
      const { number, otp } = req.body;
      if (!number || !otp)
        res.status(errorCode.FORBIDDEN).json({ message: errorMessage.MISSING_PARAMS });
      const foundUser = await UserService.getOneUser({ phoneNumber: number });
      if (!foundUser) return res.status(403).json({ message: errorMessage.NOT_FOUND });
      let isMatch = false;
      if (!foundUser.verificationCode)
        return res.status(403).json({ message: errorMessage.FLOW_ERROR });
      if (foundUser.verificationCode) isMatch = parseInt(otp) === foundUser.verificationCode;
      if (!isMatch) return res.status(403).json({ message: errorMessage.INCORRECT_DATA });
      let createdUser = {};
      const commonProps = {
        verificationCode: null,
        verificationCodeSource: null,
        verificationCodeTimestamp: null,
      };
      if (!foundUser.phoneVerified) {
        createdUser = await UserService.updateOneUser(
          { phoneNumber: number },
          {
            phoneVerified: true,
            ...commonProps,
          },
        );
      } else
        createdUser = await UserService.updateOneUser(
          { phoneNumber: number },
          {
            ...commonProps,
          },
        );
      const accessToken = await signJwt(createdUser);
      return res
        .status(201)
        .json({ messge: successMessages.SUCCESS, accessToken, user: createdUser });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async googleAuth(req: Request, res: Response) {
    try {
      const { googleAccessToken, referralUsername } = req.body;
      if (!googleAccessToken)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.MISSING_PARAMS });
      const FetchResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      });
      const { email, picture, family_name, given_name, sub } = FetchResponse.data;
      let foundUser = await UserService.getOneUser({ email });
      if (!foundUser) {
        const randomNum = (Math.random() * 25) | 1;
        const profileImage = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${randomNum}.jpg`;
        const user: any = {
          googleAuthId: sub,
          email: email,
          firstName: given_name,
          lastName: family_name,
          profileImage: picture ? picture : profileImage,
          username: email.split("@")[0],
          emailVerified: true,
        };
        if (referralUsername) {
          const referralUser = await UserService.getOneUser({ username: referralUsername });
          if (referralUser) {
            user.referralTimeStamp = new Date();
            user.referralUserId = referralUser.id;
          }
        }
        foundUser = await UserService.createOneUser(user);

        if (email && email.length > 0) {
          logger.info("sending email to: ", email);
          await sendEmail(email, "Welcome to Quiber!", "SIGNUP", {
            firstName: given_name,
            lastName: family_name,
          });
        }
      } else {
        await UserService.updateOneUser(
          { email: email },
          { googleAuthId: sub, emailVerified: true },
        );
      }
      const token = await signJwt(foundUser);
      return res
        .status(200)
        .json({ message: successMessages.SUCCESS, accessToken: token, user: foundUser });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async logout(req: Request, res: Response) {
    return res.status(200).json({ message: successMessages.SUCCESS });
  }
}

export const AuthController = new _AuthController();
