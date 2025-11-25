import { loginType } from "../schemas/login";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(data: loginType) {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: data.email,
      },
    },
  });

  if (!user) {
    return {
      success: false,
      message: "Mauvais identifiant.",
    };
  }

  const isValid = await bcrypt.compare(data.password, user.password);

  if (!isValid) {
    return {
      success: false,
      message: "Mauvais identifiant.",
    };
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    success: true,
    message: "Utilisateur créé avec succès.",
    token,
  };
}
