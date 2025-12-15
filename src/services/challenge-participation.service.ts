import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { challengeParticipationType, challengeParticipationUpdateType } from "../schemas";

export class ChallengeParticipationService {
    db: PrismaClient;

    constructor() {
        this.db = prisma;
    }

    async getAll() {
        const participations = await prisma.challengeParticipation.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                challenge: {
                    select: {
                        id: true,
                        title: true,
                        difficulty: true,
                        deadline: true,
                    },
                },
            },
        });

        return {
            success: true,
            participations,
        };
    }

    async getByUserId(userId: number) {
        const participations = await prisma.challengeParticipation.findMany({
            where: { userId },
            include: {
                challenge: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        difficulty: true,
                        deadline: true,
                        exerciseTypes: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                sessions: {
                    select: {
                        id: true,
                        date: true,
                        calories: true,
                    },
                },
            },
        });

        return {
            success: true,
            participations,
        };
    }

    async getByChallengeId(challengeId: number) {
        const participations = await prisma.challengeParticipation.findMany({
            where: { challengeId },
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
            participations,
        };
    }

    async get(id: number) {
        const participation = await prisma.challengeParticipation.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                challenge: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        difficulty: true,
                        deadline: true,
                        exerciseTypes: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                sessions: {
                    select: {
                        id: true,
                        date: true,
                        calories: true,
                        notes: true,
                    },
                },
            },
        });

        if (!participation) {
            return {
                success: false,
                message: "Participation introuvable.",
            };
        }

        return {
            success: true,
            participation,
        };
    }

    async create(data: challengeParticipationType) {
        const existingUser = await prisma.user.findUnique({
            where: { id: data.userId },
        });
        if (!existingUser) {
            return {
                success: false,
                message: "Utilisateur introuvable.",
            };
        }

        const existingChallenge = await prisma.challenge.findUnique({
            where: { id: data.challengeId },
        });
        if (!existingChallenge) {
            return {
                success: false,
                message: "Challenge introuvable.",
            };
        }

        const existingParticipation = await prisma.challengeParticipation.findFirst({
            where: {
                userId: data.userId,
                challengeId: data.challengeId,
            },
        });
        if (existingParticipation) {
            return {
                success: false,
                message: "Vous participez déjà à ce challenge.",
            };
        }

        const participation = await prisma.challengeParticipation.create({
            data: {
                userId: data.userId,
                challengeId: data.challengeId,
                progress: 0,
                caloriesBurned: 0,
            },
            include: {
                challenge: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        difficulty: true,
                        deadline: true,
                    },
                },
            },
        });

        return {
            success: true,
            message: "Participation créée avec succès.",
            participation,
        };
    }

    async update(id: number, data: challengeParticipationUpdateType) {
        const existingParticipation = await prisma.challengeParticipation.findUnique({
            where: { id },
        });
        if (!existingParticipation) {
            return {
                success: false,
                message: "Participation introuvable.",
            };
        }

        const participation = await prisma.challengeParticipation.update({
            where: { id },
            data,
            include: {
                challenge: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return {
            success: true,
            message: "Participation mise à jour.",
            participation,
        };
    }

    async complete(id: number, userId: number) {
        const existingParticipation = await prisma.challengeParticipation.findUnique({
            where: { id },
        });
        if (!existingParticipation) {
            return {
                success: false,
                message: "Participation introuvable.",
            };
        }

        if (existingParticipation.userId !== userId) {
            return {
                success: false,
                message: "Vous ne pouvez pas modifier cette participation.",
            };
        }

        if (existingParticipation.completedAt) {
            return {
                success: false,
                message: "Ce challenge a déjà été marqué comme terminé.",
            };
        }

        const participation = await prisma.challengeParticipation.update({
            where: { id },
            data: {
                completedAt: new Date(),
                progress: 100,
            },
            include: {
                challenge: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return {
            success: true,
            message: "Félicitations ! Challenge complété avec succès.",
            participation,
        };
    }
}
