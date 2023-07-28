import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../core/jwt.core";
import { JourneyService } from "../services/journey.service";

export const deserializeUserOnRequest = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  if (!accessToken) return next();
  const { decoded }: any = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    await JourneyService.createJourney({
      userId: decoded.id,
      path: req.originalUrl,
      method: req.method,
    });
    return next();
  }

  return next();
};
