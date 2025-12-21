import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { challengeType } from "../schemas";

export class ChallengeService {
  db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async getAll() {
    const challenges = await prisma.challenge.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gym: {
          select: {
            id: true,
            name: true,
          },
        },
        exerciseTypes: {
          select: {
            id: true,
            name: true,
          },
        },
        equipments: {
          select: {
            id: true,
            name: true,
            quantity: true,
          },
        },
      },
    });

    return {
      success: true,
      challenges,
    };
  }

  async get(id: number) {
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gym: {
          select: {
            id: true,
            name: true,
          },
        },
        exerciseTypes: {
          select: {
            id: true,
            name: true,
          },
        },
        equipments: {
          select: {
            id: true,
            name: true,
            quantity: true,
          },
        },
      },
    });

    if (!challenge) {
      return {
        success: false,
        message: "Défi introuvable.",
      };
    }

    return {
      success: true,
      challenge,
    };
  }

  async create(data: challengeType, userId: number, userRole: string) {
    const exerciseTypeCount = await prisma.exerciseType.count({
      where: { id: { in: data.exerciseTypeIds } },
    });

    if (exerciseTypeCount !== data.exerciseTypeIds.length) {
      return {
        success: false,
        message: `Un ou plusieurs types d'exercices sont introuvables.`,
      };
    }

    if (data.gymId) {
      const gym = await prisma.gym.findUnique({
        where: { id: data.gymId },
      });

      if (!gym) {
        return {
          success: false,
          message: "Salle de sport introuvable.",
        };
      }

      if (userRole === "OWNER") {
        if (gym.ownerId !== userId) {
          return {
            success: false,
            message: "Vous n'êtes pas propriétaire de cette salle de sport.",
          };
        }

        if (gym.status !== "APPROVED") {
          return {
            success: false,
            message: "Vous ne pouvez créer des défis que pour les salles de sport approuvées.",
          };
        }
      }

      if (data.equipmentIds && data.equipmentIds.length > 0) {
        const trainingRooms = await prisma.trainingRoom.findMany({
          where: { gymId: data.gymId },
          include: {
            equipments: {
              select: {
                id: true,
              },
            },
          },
        });

        const availableEquipments = trainingRooms.flatMap(tr => tr.equipments);
        const availableEquipmentIds = availableEquipments.map(eq => eq.id);

        const missingEquipmentIds = data.equipmentIds.filter((id: number) => !availableEquipmentIds.includes(id));

        if (missingEquipmentIds.length > 0) {
          return {
            success: false,
            message: `Un ou plusieurs équipements ne sont pas disponibles dans cette salle de sport. IDs introuvables: ${missingEquipmentIds.join(", ")}.`,
          };
        }
      }
    } else {
      if (userRole !== "USER") {
        return {
          success: false,
          message: "Seuls les utilisateurs peuvent créer des défis personnels (sans salle de sport).",
        };
      }
    }

    const challenge = await prisma.challenge.create({
      data: {
        title: data.title,
        description: data.description,
        challengeExercises: data.challengeExercises,
        duration: data.duration,
        deadline: data.deadline,
        difficulty: data.difficulty,
        creatorId: userId,
        gymId: data.gymId || null,
        exerciseTypes: {
          connect: data.exerciseTypeIds.map((id: number) => ({ id })),
        },
        equipments: data.equipmentIds && data.gymId
          ? {
              connect: data.equipmentIds.map((id: number) => ({ id })),
            }
          : undefined,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gym: {
          select: {
            id: true,
            name: true,
          },
        },
        exerciseTypes: {
          select: {
            id: true,
            name: true,
          },
        },
        equipments: {
          select: {
            id: true,
            name: true,
            quantity: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Défi créé avec succès.",
      challenge,
    };
  }



  async update(id: number, data: challengeType, userId: number, userRole: string) {
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        gym: true,
      },
    });

    if (!existingChallenge) {
      return {
        success: false,
        message: "Défi introuvable.",
      };
    }

    const existingExerciseTypes = await prisma.exerciseType.findMany({
      where: { id: { in: data.exerciseTypeIds } },
    });

    if (existingExerciseTypes.length !== data.exerciseTypeIds.length) {
      const existingIds = existingExerciseTypes.map(et => et.id);
      const missingIds = data.exerciseTypeIds.filter((id: number) => !existingIds.includes(id));
      return {
        success: false,
        message: `Un ou plusieurs types d'exercices sont introuvables. IDs introuvables: ${missingIds.join(", ")}.`,
      };
    }

    const exerciseTypeIds = existingExerciseTypes.map(et => et.id);

    if (userRole !== "ADMIN" && existingChallenge.creatorId !== userId) {
      return {
        success: false,
        message: "Vous n'êtes pas le créateur de ce défi.",
      };
    }

    if (data.gymId) {
      const gym = await prisma.gym.findUnique({
        where: { id: data.gymId },
      });

      if (!gym) {
        return {
          success: false,
          message: "Salle de sport introuvable.",
        };
      }

      if (userRole === "OWNER") {
        if (gym.ownerId !== userId) {
          return {
            success: false,
            message: "Vous n'êtes pas propriétaire de cette salle de sport.",
          };
        }

        if (gym.status !== "APPROVED") {
          return {
            success: false,
            message: "Vous ne pouvez créer des défis que pour les salles de sport approuvées.",
          };
        }
      }

      if (data.equipmentIds && data.equipmentIds.length > 0) {
        const trainingRooms = await prisma.trainingRoom.findMany({
          where: { gymId: data.gymId },
          include: {
            equipments: {
              select: {
                id: true,
              },
            },
          },
        });

        const availableEquipments = trainingRooms.flatMap(tr => tr.equipments);
        const availableEquipmentIds = availableEquipments.map(eq => eq.id);

        const missingEquipmentIds = data.equipmentIds.filter((id: number) => !availableEquipmentIds.includes(id));

        if (missingEquipmentIds.length > 0) {
          return {
            success: false,
            message: `Un ou plusieurs équipements ne sont pas disponibles dans cette salle de sport. IDs introuvables: ${missingEquipmentIds.join(", ")}.`,
          };
        }
      }
    } else {
      if (userRole !== "USER" && userRole !== "ADMIN") {
        return {
          success: false,
          message: "Seuls les utilisateurs peuvent avoir des défis personnels (sans salle de sport).",
        };
      }
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        challengeExercises: data.challengeExercises,
        duration: data.duration,
        difficulty: data.difficulty,
        gymId: data.gymId || null,
        exerciseTypes: {
          set: data.exerciseTypeIds.map((id: number) => ({ id })),
        },
        equipments: data.equipmentIds && data.gymId
          ? {
              set: data.equipmentIds.map((id: number) => ({ id })),
            }
          : undefined,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gym: {
          select: {
            id: true,
            name: true,
          },
        },
        exerciseTypes: {
          select: {
            id: true,
            name: true,
          },
        },
        equipments: {
          select: {
            id: true,
            name: true,
            quantity: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Défi modifié avec succès.",
      challenge,
    };
  }

  async delete(id: number, userId: number, userRole: string) {
    const challenge = await prisma.challenge.findUnique({
      where: { id },
    });

    if (!challenge) {
      return {
        success: false,
        message: "Défi introuvable.",
      };
    }

    if (userRole !== "ADMIN" && challenge.creatorId !== userId) {
      return {
        success: false,
        message: "Vous n'êtes pas le créateur de ce défi.",
      };
    }

    await prisma.challenge.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Défi supprimé avec succès.",
    };
  }
}

