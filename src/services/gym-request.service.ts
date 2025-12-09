import { GymStatus, PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { gymRequestType, gymRequestDecisionType } from "../schemas";

export class GymRequestService {
  db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async getAll() {
    const gymRequests = await prisma.gymRequest.findMany({
      include: {
        owner: {
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
        owner: {
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

  async create(data: gymRequestType, userId: number) {
    const gymRequest = await prisma.gymRequest.create({
      data: {
        ...data,
        ownerId: userId,
        status: GymStatus.PENDING,
      },
    });

    return {
      success: true,
      message: "Demande de création de salle soumise avec succès.",
      gymRequest,
    };
  }

  async submitDecision(data: gymRequestDecisionType, id: number) {
    const isExstingGymRequest = await prisma.gymRequest.findUnique({
      where: { id },
    });
    if (!isExstingGymRequest) {
      return {
        success: false,
        message: "Demande de création de salle introuvable.",
      };
    }

    /* If approved, create a new gym */
    if (data.status === GymStatus.APPROVED) {
      await prisma.gym.create({
        data: {
          ...data,
          ownerId: isExstingGymRequest.ownerId,
        },
      })
    }

    /* Update the gym request */
    const gymRequest = await prisma.gymRequest.update({
      where: { id },
      data
    });

    return {
      success: true,
      message: "Décision soumise avec succès.",
      gymRequest,
    };
  }
}

