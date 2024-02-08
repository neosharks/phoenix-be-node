import { Request, Response } from "express";
import bcrypt from "bcrypt";
import axios from "axios";
import { UserService } from "../services/user.service";
import { signJwt } from "../core/jwt.core";
import { generateOtp, generateRandomUsername } from "../lib/helper.lib";
import { errorCode, errorMessage } from "../constant/api.constant";
import logger from "../core/logger.core";
import sendEmail from "../core/email.core";

class _AuthController {
  async register(req: Request, res: Response) {
    try {
      const body = req.body;
      const foundUser = await UserService.getOneUser({ email: body.email });
      if (foundUser)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.USER_EXISTS });
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hash = await bcrypt.hashSync(body.password, salt);
      body.password = hash;
      body.username = body.email.split("@")[0];
      const randomNum = (Math.random() * 25) | 1;
      const profileImage = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${randomNum}.jpg`;
      const created = await UserService.createOneUser({ ...body, profileImage });
      if (body.email && body.email.length > 0) {
        await sendEmail(body.email, "Welcome to Qalakar!", "SIGNUP", {
          firstName: body.firstName,
          lastName: body.lastName,
        });
      }
      const accessToken = await signJwt(created);
      return res.status(201).json({ messge: "success", accessToken, user: created });
    } catch (err) {
      logger.error("Error in register");
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: err });
    }
  }

  async login(req: Request, res: Response) {
    const body = req.body;
    const foundUser = await UserService.getOneUser({ email: body.email });
    if (!foundUser) return res.status(403).json({ message: "User is not registered" });
    let isMatch = false;
    if (foundUser.password) isMatch = await bcrypt.compareSync(body.password, foundUser.password);
    if (!foundUser.password) return res.status(403).json({ message: "Login via OAuth" });
    if (!isMatch) return res.status(403).json({ message: "Wrong Password" });
    const accessToken = await signJwt(foundUser);
    return res.status(200).json({ messge: "success", accessToken, user: foundUser });
  }

  async sendOtp(req: Request, res: Response) {
    const { number } = req.body;
    if (!number)
      return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.MISSING_PARAMS });
    const foundUser = await UserService.getOneUser({ phoneNumber: number });
    let otpGenerated = Math.floor(Math.random() * 9000) + 1000;
    const commonProps = {
      verificationCode: otpGenerated,
      verificationCodeSource: "SMS",
    };
    if (foundUser) await UserService.updateOneUser({ phoneNumber: number }, { ...commonProps });
    else {
      const username = generateRandomUsername();
      const randomNum = (Math.random() * 25) | 1;
      const profileImage = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${randomNum}.jpg`;
      await UserService.createOneUser({
        username,
        phoneNumber: number,
        profileImage,
        ...commonProps,
      });
    }
    return res.status(200).json({ message: "OTP successfully sent" });
  }

  async forgetPassword(req: Request, res: Response) {
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
    return res.status(200).json({ message: "OTP successfully sent", email });
  }

  async requestEmailOtp(req: Request, res: Response) {
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
    return res.status(200).json({ message: "OTP successfully sent", email });
  }

  async verifyForgetPassword(req: Request, res: Response) {
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
    return res.status(200).json({ message: "Password Updated" });
  }

  async resetPassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const { password, id } = res.locals.user;
    if (!oldPassword || !newPassword)
      return res.status(errorCode.GENERIC).json({ message: errorMessage.MISSING_PARAMS });
    if (!password) return res.status(403).json({ message: "Login via OAuth" });
    let isMatch = false;
    isMatch = await bcrypt.compareSync(oldPassword, password);
    if (!isMatch) return res.status(403).json({ message: "Wrong Password" });
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(newPassword, salt);
    await UserService.updateOneUser({ id }, { password: hash });
    const accessToken = await signJwt(res.locals.user);
    return res.status(200).json({ message: "Success", accessToken });
  }

  async loginViaNumber(req: Request, res: Response) {
    const { number, otp } = req.body;
    if (!number || !otp)
      res.status(errorCode.FORBIDDEN).json({ message: errorMessage.MISSING_PARAMS });
    const foundUser = await UserService.getOneUser({ phoneNumber: number });
    if (!foundUser) return res.status(403).json({ message: "User is not registered" });
    let isMatch = false;
    if (!foundUser.verificationCode) return res.status(403).json({ message: "Generate OTP first" });
    if (foundUser.verificationCode) isMatch = parseInt(otp) === foundUser.verificationCode;
    if (!isMatch) return res.status(403).json({ message: "Incorrect OTP" });
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
    return res.status(201).json({ messge: "success", accessToken, user: createdUser });
  }

  async googleAuth(req: Request, res: Response) {
    const { googleAccessToken } = req.body;
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
      const user = {
        googleAuthId: sub,
        email: email,
        firstName: given_name,
        lastName: family_name,
        profileImage: picture ? picture : profileImage,
        username: email.split("@")[0],
        emailVerified: true,
      };
      foundUser = await UserService.createOneUser(user);

      if (email && email.length > 0) {
        logger.info("sending email to: ", email);
        await sendEmail(email, "Welcome to Qalakar!", "SIGNUP", {
          firstName: given_name,
          lastName: family_name,
        });
      }
    } else {
      await UserService.updateOneUser({ email: email }, { googleAuthId: sub, emailVerified: true });
    }
    const token = await signJwt(foundUser);
    return res.status(200).json({ message: "Success", accessToken: token, user: foundUser });
  }

  async logout(req: Request, res: Response) {
    return res.status(200).json({ message: "Logged out" });
  }
}

export const AuthController = new _AuthController();
