import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload extends jwt.JwtPayload {
  userId: number;
  role: UserRole;
}

const verifyAuth = (token: string): AuthPayload | null => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    if (!payload.userId || !payload.role) return null;
    return payload;
  } catch {
    return null;
  }
};

const getAuthPayload = (req: Request): jwt.JwtPayload | null => {
  const header = req.headers["authorization"];
  if (!header?.startsWith("Bearer ")) return null;

  const token = header.split(" ")[1];
  return verifyAuth(token);
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = getAuthPayload(req);
    if (!payload)
      return res.status(401).json({ message: "Vous n'êtes pas connecté." });

    if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role as UserRole)) {
      return res.status(403).json({ message: "Vous n'avez pas les droits." });
    }

    req.user = { userId: payload.userId, role: payload.role as UserRole };
    next();
  };
};

export const auth = requireRole(); 
export const authAdmin = requireRole(UserRole.ADMIN);
export const authOwnerOrAdmin = requireRole(UserRole.OWNER, UserRole.ADMIN);
