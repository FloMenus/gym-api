import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Vous n'êtes pas connecté." });
  }

  const token = header.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Vous n'êtes pas connecté." });
    }

    if (
      typeof payload === "object" &&
      payload !== null &&
      "userId" in payload &&
      "role" in payload
    ) {
      req.user = {
        userId: (payload as any).userId,
        role: (payload as any).role,
      };
      next();
    } else {
      return res.status(403).json({ message: "Token invalide." });
    }
  });
};
