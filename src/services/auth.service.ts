import { PrismaClient, UserRole } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { loginType, promoteType, registerType } from "../schemas";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { success } from "zod";

export class AuthService {
  db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async profile(userId: number) {
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

  async login(data: loginType) {
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

  async register(data: registerType) {
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

  async promoteToAdmin(data: promoteType) {

    const userExist = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!userExist) {
      return {
        success: false,
        message: "Utilisateur introuvable.",
      };
    }

    if (userExist.role === UserRole.ADMIN) {
      return {
        success: false,
        message: "L'utilisateur est déjà un administrateur.",
      };
    }

    await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        role: UserRole.ADMIN,
      },
    })

    return {
      success: true,
      message: "Utilisateur promu au rôle d'administrateur avec succès.",
    }
  }
}
