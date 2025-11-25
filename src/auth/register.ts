import { registerType } from "../schemas/register";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";

export async function register(data: registerType) {
  const userExist = await prisma.user.count({
    where: {
      email: {
        equals: data.email,
      },
    },
  });

  if (userExist > 0) {
    return {
      success: false,
      message: "Utilisateur déjà existant.",
    };
  }

  const hash = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      email: data.email,
      password: hash,
      name: data.name,
    },
  });

  return {
    success: true,
    message: "Utilisateur créé avec succès.",
  };
}
