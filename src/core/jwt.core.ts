import jwt from "jsonwebtoken";
import config from "../../config";
import logger from "./logger.core";

// TODO: IMPLEMENT REFRESH TOKEN AND ASYMETRIC KEY GENERATION

export const signJwt = async (user: Object, options?: jwt.SignOptions | undefined) => {
  return jwt.sign(user, config.jwt.accessTokenKey, {
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
    logger.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
};
