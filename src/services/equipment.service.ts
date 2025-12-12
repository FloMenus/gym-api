import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { equipmentType } from "../schemas";

export class EquipmentService {
    db: PrismaClient;

    constructor() {
        this.db = prisma;
    }

/*     async getAllFromGym(gymId: number) {
        const isExistingGym = await prisma.gym.findUnique({
            where: { id: gymId },
        });
        if (!isExistingGym) {
            return {
                success: false,
                message: "Salle de sport introuvable.",
            };
        }
        
        const equipments = await prisma.equipment.findMany({
            where: { gymId },
        });

        return {
            success: true,
            equipments,
        };
    }
 */
    async get(id: number) {
        const equipment = await prisma.equipment.findUnique({
            where: { id },
        });

        if (!equipment) {
            return {
                success: false,
                message: "Équipement introuvable.",
            };
        }

        return {
            success: true,
            equipment,
        };
    }

    async create(data: equipmentType) {
        const isExistingTrainingRoom = await prisma.trainingRoom.findUnique({
            where: { id: data.trainingRoomId },
        });
        if (!isExistingTrainingRoom) {
            return {
                success: false,
                message: "Salle d'entraînement introuvable.",
            };
        }

        const equipment = await prisma.equipment.create({
            data,
        });

        return {
            success: true,
            message: "Équipement créé.",
            equipment,
        };
    }

    async update(id: number, data: equipmentType) {
        const isExistingGym = await prisma.gym.findUnique({
            where: { id: data.gymId },
        });
        if (!isExistingGym) {
            return {
                success: false,
                message: "Salle de sport introuvable.",
            };
        }

        const equipment = await prisma.equipment.update({
            where: { id },
            data,
        });

        return {
            success: true,
            message: "Équipement modifié.",
            equipment,
        };
    }

    async delete(id: number) {
        const equipment = await prisma.equipment.findUnique({
            where: { id },
        });
        if (!equipment) {
            return {
                success: false,
                message: "Équipement introuvable.",
            };
        }

        await prisma.equipment.delete({
            where: { id },
        });

        return {
            success: true,
            message: "Équipement supprimé.",
        };
    }
}