import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { gymRequestType } from "../schemas";

export class GymRequestService {
  db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async create(data: gymRequestType, userId: number) {
    const gymRequest = await prisma.gymRequest.create({
      data: {
        ...data,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Demande de création de salle soumise avec succès.",
      gymRequest,
    };
  }

  async getAll() {
    const gymRequests = await prisma.gymRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      gymRequests,
    };
  }

  async get(id: number) {
    const gymRequest = await prisma.gymRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!gymRequest) {
      return {
        success: false,
        message: "Demande de création de salle introuvable.",
      };
    }

    return {
      success: true,
      gymRequest,
    };
  }

}

