import { prisma } from "../utils/prisma";

export async function profil(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: false,
      createdAt: true,
      updatedAt: true,
      isActive: false,
      email: true,
      password: false,
      name: true,
      role: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "Utilisateur introuvable.",
    };
  }

  return {
    success: true,
    user,
  };
}
