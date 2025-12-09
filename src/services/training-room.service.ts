import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { trainingRoomType, trainingRoomUpdateType } from "../schemas";

export class TrainingRoomService {
    db: PrismaClient;

    constructor() {
        this.db = prisma;
    }

    async getAll() {
        const trainingRooms = await prisma.trainingRoom.findMany({
            include: {
                exerciseTypes: {
                    select: {
                        id: true,
                        name: true,
                    },
                }
            },
        });

        return {
            success: true,
            trainingRooms,
        };
    }

    async getByGymId(gymId: number) {
        const trainingRooms = await prisma.trainingRoom.findMany({
            where: { gymId },
            include: {
                exerciseTypes: {
                    select: {
                        id: true,
                        name: true,
                    },
                }
            },
        });

        return {
            success: true,
            trainingRooms,
        };
    }

    async getByExerciseTypeId(exerciseTypeId: number) {
        const trainingRooms = await prisma.trainingRoom.findMany({
            where: {
                exerciseTypes: {
                    some: {
                        id: exerciseTypeId,
                    },
                },
            },
            include: {
                exerciseTypes: {
                    select: {
                        id: true,
                        name: true,
                    },
                }
            },
        });

        return {
            success: true,
            trainingRooms,
        };
    }

    async create(data: trainingRoomType) {
        const existingGym = await prisma.gym.findUnique({
            where: { id: data.gymId },
        });
        if (!existingGym) {
            return {
                success: false,
                message: "Salle de sport introuvable.",
            };
        }

        const existingExerciseTypes = await prisma.exerciseType.findMany({
            where: { id: { in: data.exerciseTypeIds } },
        });
        if (existingExerciseTypes.length !== data.exerciseTypeIds.length) {
            return {
                success: false,
                message: "Un ou plusieurs types d'exercices sont introuvables.",
            };
        }

        const trainingRoom = await prisma.trainingRoom.create({
            data: {
                ...data,
                exerciseTypes: {
                    connect: data.exerciseTypeIds.map((id: number) => ({ id })),
                },
            },
        });

        return {
            success: true,
            message: "Salle d'entraînement créée.",
            trainingRoom,
        };
    }

    async update(data: trainingRoomUpdateType) {
        const existingTrainingRoom = await prisma.trainingRoom.findUnique({
            where: { id: data.id },
        });
        if (!existingTrainingRoom) {
            return {
                success: false,
                message: "Salle d'entraînement introuvable.",
            };
        }

        const existingGym = await prisma.gym.findUnique({
            where: { id: data.gymId },
        });
        if (!existingGym) {
            return {
                success: false,
                message: "Salle de sport introuvable.",
            };
        }

        const existingExerciseTypes = await prisma.exerciseType.findMany({
            where: { id: { in: data.exerciseTypeIds } },
        });
        if (existingExerciseTypes.length !== data.exerciseTypeIds.length) {
            return {
                success: false,
                message: "Un ou plusieurs types d'exercices sont introuvables.",
            };
        }
        const trainingRoom = await prisma.trainingRoom.update({
            where: { id: data.id },
            data: {
                ...data,
                exerciseTypes: {
                    set: data.exerciseTypeIds.map((id: number) => ({ id })),
                },
            },
        });

        return {
            success: true,
            message: "Salle d'entraînement mise à jour.",
            trainingRoom,
        };
    }
}