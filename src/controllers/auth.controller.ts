import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserService } from "../services/user.service";
import { signJwt } from "../core/jwt.core";
import { generateRandomUsername } from "../lib/helper.lib";
import { errorCode, errorMessage } from "../constant/api.constant";
import logger from "../core/logger.core";

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
    return res.status(201).json({ messge: "success", accessToken, user: foundUser });
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
      verificationCodeType: null,
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
}

export const AuthController = new _AuthController();
