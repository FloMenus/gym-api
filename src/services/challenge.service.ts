import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { challengeType } from "../schemas";

export class ChallengeService {
    db: PrismaClient;

    constructor() {
        this.db = prisma;
    }

    async create(data: challengeType) {
        const isExistingCreator = await prisma.user.findUnique({
            where: { id: data.creatorId },
        });
        if (!isExistingCreator) {
            return {
                success: false,
                message: "Créateur introuvable.",
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

        const challenge = await prisma.challenge.create({
            data: {
                title: data.title,
                description: data.description,
                difficulty: data.difficulty,
                deadline: data.deadline,
                creatorId: data.creatorId,
                exerciseTypes: {
                    connect: data.exerciseTypeIds.map((id) => ({ id })),
                },
            },
            include: {
                exerciseTypes: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                creator: {
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
            message: "Challenge créé avec succès.",
            challenge,
        };
    }
}