import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { gymType } from "../schemas";

export class GymService {
    db: PrismaClient;

    constructor() {
        this.db = prisma;
    }

    async getAll() {
        const gyms = await prisma.gym.findMany();

        return {
            success: true,
            gyms,
        };
    }

    async get(id: number) {
        const gym = await prisma.gym.findUnique({
            where: { id },
        });

        if (!gym) {
            return {
                success: false,
                message: "Salle de sport introuvable.",
            };
        }

        return {
            success: true,
            gym,
        };
    }

    async create(data: gymType) {
        const isExstingOwner = await prisma.user.findUnique({
            where: { id: data.ownerId },
        });
        if (!isExstingOwner) {
            return {
                success: false,
                message: "Propriétaire introuvable.",
            };
        }

        const gym = await prisma.gym.create({
            data,
        });

        return {
            success: true,
            message: "Salle de sport créée.",
            gym,
        };
    }

    async update(id: number, data: gymType, userId?: number, userRole?: string) {
        const existingGym = await prisma.gym.findUnique({
            where: { id },
        });

        if (!existingGym) {
            return {
                success: false,
                message: "Salle de sport introuvable.",
            };
        }

        if (userRole === "OWNER" && userId) {
            if (existingGym.ownerId !== userId) {
                return {
                    success: false,
                    message: "Vous n'êtes pas propriétaire de cette salle de sport.",
                };
            }

            if (existingGym.status !== "APPROVED") {
                return {
                    success: false,
                    message: "Vous ne pouvez modifier que les salles de sport approuvées.",
                };
            }

            const { status, ownerId, ...ownerAllowedData } = data;
            const updateData = {
                ...ownerAllowedData,
                status: existingGym.status,
                ownerId: existingGym.ownerId, 
            };

            const gym = await prisma.gym.update({
                where: { id },
                data: updateData,
            });

            return {
                success: true,
                message: "Salle de sport modifiée.",
                gym,
            };
        }


        if (data.ownerId !== existingGym.ownerId) {
            const isExistingOwner = await prisma.user.findUnique({
                where: { id: data.ownerId },
            });
            if (!isExistingOwner) {
                return {
                    success: false,
                    message: "Propriétaire introuvable.",
                };
            }
        }

        const gym = await prisma.gym.update({
            where: { id },
            data,
        });

        return {
            success: true,
            message: "Salle de sport modifiée.",
            gym,
        };
    }

    async delete(id: number, userId?: number, userRole?: string) {
        const gym = await prisma.gym.findUnique({
            where: { id },
        });
        if (!gym) {
            return {
                success: false,
                message: "Salle de sport introuvable.",
            };
        }

        if (userRole === "OWNER" && userId) {
            if (gym.ownerId !== userId) {
                return {
                    success: false,
                    message: "Vous n'êtes pas propriétaire de cette salle de sport.",
                };
            }

            if (gym.status !== "APPROVED") {
                return {
                    success: false,
                    message: "Désoler vous ne pouvez supprimer que les salles de sport approuvées :(",
                };
            }
        }

        await prisma.gym.delete({
            where: { id },
        });

        return {
            success: true,
            message: "Salle de sport supprimée.",
        };
    }
}