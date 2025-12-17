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
    const existingExerciseTypes = await prisma.exerciseType.findMany({
      where: { name: { in: data.exerciseTypeNames } },
    });

    if (existingExerciseTypes.length !== data.exerciseTypeNames.length) {
      const existingNames = existingExerciseTypes.map(et => et.name);
      const missingNames = data.exerciseTypeNames.filter((name: string) => !existingNames.includes(name));
      return {
        success: false,
        message: `Un ou plusieurs types d'exercices sont introuvables. Noms introuvables: ${missingNames.join(", ")}.`,
      };
    }

    const exerciseTypeIds = existingExerciseTypes.map(et => et.id);

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

      if (data.equipmentNames && data.equipmentNames.length > 0) {
        const trainingRooms = await prisma.trainingRoom.findMany({
          where: { gymId: data.gymId },
          include: {
            equipments: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        const availableEquipments = trainingRooms.flatMap(tr => tr.equipments);
        const availableEquipmentNames = availableEquipments.map(eq => eq.name);

        const missingEquipmentNames = data.equipmentNames.filter((name: string) => !availableEquipmentNames.includes(name));

        if (missingEquipmentNames.length > 0) {
          return {
            success: false,
            message: `Un ou plusieurs équipements ne sont pas disponibles dans cette salle de sport. Noms introuvables: ${missingEquipmentNames.join(", ")}.`,
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
        difficulty: data.difficulty,
        creatorId: userId,
        gymId: data.gymId || null,
        exerciseTypes: {
          connect: exerciseTypeIds.map((id: number) => ({ id })),
        },
        equipments: data.equipmentNames && data.gymId
          ? {
              connect: await this.getEquipmentIdsByNames(data.equipmentNames, data.gymId),
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

  private async getEquipmentIdsByNames(equipmentNames: string[], gymId: number) {
    const trainingRooms = await prisma.trainingRoom.findMany({
      where: { gymId },
      include: {
        equipments: {
          where: { name: { in: equipmentNames } },
          select: { id: true },
        },
      },
    });

    const equipmentIds = trainingRooms.flatMap(tr => tr.equipments.map(eq => ({ id: eq.id })));
    return equipmentIds;
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
      where: { name: { in: data.exerciseTypeNames } },
    });

    if (existingExerciseTypes.length !== data.exerciseTypeNames.length) {
      const existingNames = existingExerciseTypes.map(et => et.name);
      const missingNames = data.exerciseTypeNames.filter((name: string) => !existingNames.includes(name));
      return {
        success: false,
        message: `Un ou plusieurs types d'exercices sont introuvables. Noms introuvables: ${missingNames.join(", ")}.`,
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

      if (data.equipmentNames && data.equipmentNames.length > 0) {
        const trainingRooms = await prisma.trainingRoom.findMany({
          where: { gymId: data.gymId },
          include: {
            equipments: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        const availableEquipments = trainingRooms.flatMap(tr => tr.equipments);
        const availableEquipmentNames = availableEquipments.map(eq => eq.name);

        const missingEquipmentNames = data.equipmentNames.filter((name: string) => !availableEquipmentNames.includes(name));

        if (missingEquipmentNames.length > 0) {
          return {
            success: false,
            message: `Un ou plusieurs équipements ne sont pas disponibles dans cette salle de sport. Noms introuvables: ${missingEquipmentNames.join(", ")}.`,
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
          set: exerciseTypeIds.map((id: number) => ({ id })),
        },
        equipments: data.equipmentNames && data.gymId
          ? {
              set: await this.getEquipmentIdsByNames(data.equipmentNames, data.gymId),
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

