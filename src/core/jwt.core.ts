import jwt from "jsonwebtoken";
import config from "../../config";
import logger from "./logger.core";

// TODO: IMPLEMENT REFRESH TOKEN AND ASYMETRIC KEY GENERATION

export const signJwt = async (user: any, options?: jwt.SignOptions | undefined) => {
  return jwt.sign({ id: user.id }, config.jwt.accessTokenKey, {
    expiresIn: 86400, // expires in 24 hours
  });
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwt.accessTokenKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.log(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
};
