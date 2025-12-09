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

    async update(id: number, data: gymType) {
        const isExstingOwner = await prisma.user.findUnique({
            where: { id: data.ownerId },
        });
        if (!isExstingOwner) {
            return {
                success: false,
                message: "Propriétaire introuvable.",
            };
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

    async delete(id: number) {
        const gym = await prisma.gym.findUnique({
            where: { id },
        });
        if (!gym) {
            return {
                success: false,
                message: "Salle de sport introuvable.",
            };
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