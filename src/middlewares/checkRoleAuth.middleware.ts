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
      // if (foundUser.status !== "ACTIVE")
      //   return res.status(403).json({ message: errorMessage.USER_BLOCKED, info: "User blocked" });
      res.locals.user = foundUser;
      const userRoles = foundUser?.role || [];

      let hasRequiredRole = false;
      requiredRoles.forEach((requiredRole: string) => {
        if (userRoles.includes(requiredRole)) hasRequiredRole = true;
      });

      if (hasRequiredRole) {
        return next();
      } else {
        return res.status(403).json({ message: errorCode.UNAUTHORISED, info: "Roles not found" });
      }
    } else {
      return res.sendStatus(403);
    }
  };
};

export const checkSocketRoleAuth = (requiredRoles = ["PATRON"]) => {
  return async (socket: Socket, next: (err?: Error) => void) => {
    console.log(socket, "sad");
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error(errorMessage.TOKEN_MISSING));
      }

      const { decoded }: any = verifyJwt(token.replace(/^Bearer\s/, ""));
      if (!decoded) {
        return next(new Error(errorMessage.UNAUTHORISED));
      }

      const { id } = decoded;
      const foundUser: any = await UserService.getOneUser({ id });
      if (!foundUser) {
        return next(new Error(errorMessage.UNAUTHORISED));
      }

      const userRoles = foundUser?.role || [];
      const hasRequiredRole = requiredRoles.some((requiredRole: string) =>
        userRoles.includes(requiredRole),
      );

      if (!hasRequiredRole) {
        return next(new Error(errorMessage.UNAUTHORISED));
      }

      socket.data.user = foundUser; // Attach user data to the socket instance
      next();
    } catch (error) {
      next(new Error(errorMessage.UNAUTHORISED));
    }
  };
};
