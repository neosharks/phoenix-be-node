import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
import { get } from "lodash";
import { verifyJwt } from "../core/jwt.core";
import { UserService } from "../services/user.service";
import { errorCode, errorMessage } from "../constant/api.constant";

export const checkRoleAuth = (requiredRoles = ["PATRON"]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    if (!accessToken)
      return res.status(403).json({ message: errorMessage.TOKEN_MISSING, info: "No token" });
    const { decoded }: any = verifyJwt(accessToken);

    if (decoded) {
      const { id } = decoded;
      const foundUser: any = await UserService.getOneUser({ id });
      if (!foundUser)
        return res.status(403).json({ message: errorMessage.UNAUTHORISED, info: "User not found" });
      res.locals.user = foundUser;
      const userRoles = foundUser?.role || [];

      let hasRequiredRole = false;
      requiredRoles.forEach((requiredRole: string) => {
        if (userRoles.includes(requiredRole)) hasRequiredRole = true;
      });

      if (hasRequiredRole) {
        return next();
      } else {
        return res.status(403).json({ message: 403, info: "Roles not found" });
      }
    } else {
      return res.sendStatus(403);
    }
  };
};
