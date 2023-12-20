import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../core/jwt.core";
import { UserService } from "../services/user.service";

export const checkRoleAuth = (requiredRoles = ["PATRON"]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    if (!accessToken) return res.status(403).json({ message: "No token found" });
    const { decoded }: any = verifyJwt(accessToken);

    if (decoded) {
      const { id } = decoded;
      const foundUser: any = await UserService.getOneUser({ id });
      if (!foundUser) return res.status(403).json({ message: "User not found" });
      res.locals.user = foundUser;
      const userRoles = foundUser?.role || [];

      let hasRequiredRole = false;
      requiredRoles.forEach((requiredRole: string) => {
        if (userRoles.includes(requiredRole)) hasRequiredRole = true;
      });

      if (hasRequiredRole) {
        return next();
      } else {
        return res.status(403).json({ message: "Unauthorised" });
      }
    } else {
      return res.sendStatus(403);
    }
  };
};
