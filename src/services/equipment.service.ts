import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { equipmentType } from "../schemas";

export class EquipmentService {
    db: PrismaClient;

    constructor() {
        this.db = prisma;
    }

    async getAllFromGym(gymId: number) {
        const gym = await prisma.gym.findUnique({
            where: { id: gymId },
            include: {
                trainingRooms: {
                    include: {
                        equipments: true,
                    },
                },
            },
        });
        if (!gym) {
            return {
                success: false,
                message: "Salle de sport introuvable.",
            };
        }
        
        const equipments = gym.trainingRooms.flatMap(tr => tr.equipments);

        return {
            success: true,
            equipments,
        };
    }

    async get(id: number) {
        const equipment = await prisma.equipment.findUnique({
            where: { id },
            include: {
                trainingRoom: {
                    include: {
                        gym: true,
                    },
                },
            },
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

    async create(data: equipmentType, userId: number, userRole: string) {
        const trainingRoom = await prisma.trainingRoom.findUnique({
            where: { id: data.trainingRoomId },
            include: { gym: true },
        });

        if (!trainingRoom) {
            return {
                success: false,
                message: "Salle d'entraînement introuvable.",
            };
        }

        if (userRole === "OWNER" && trainingRoom.gym.ownerId !== userId) {
            return {
                success: false,
                message: "Vous n'êtes pas propriétaire de cette salle de sport.",
            };
        }

        const equipment = await prisma.equipment.create({
            data: {
                name: data.name,
                quantity: data.quantity,
                trainingRoomId: data.trainingRoomId,
            },
        });

        return {
            success: true,
            message: "Équipement créé.",
            equipment,
        };
    }

    async update(id: number, data: equipmentType, userId: number, userRole: string) {
        const equipment = await prisma.equipment.findUnique({
            where: { id },
            include: {
                trainingRoom: {
                    include: { gym: true },
                },
            },
        });

        if (!equipment) {
            return {
                success: false,
                message: "Équipement introuvable.",
            };
        }

        if (userRole === "OWNER" && equipment.trainingRoom.gym.ownerId !== userId) {
            return {
                success: false,
                message: "Vous n'êtes pas propriétaire de cette salle de sport.",
            };
        }

        const trainingRoom = await prisma.trainingRoom.findUnique({
            where: { id: data.trainingRoomId },
            include: { gym: true },
        });

        if (!trainingRoom) {
            return {
                success: false,
                message: "Salle d'entraînement introuvable.",
            };
        }

        if (userRole === "OWNER" && trainingRoom.gym.ownerId !== userId) {
            return {
                success: false,
                message: "Vous n'êtes pas propriétaire de cette salle de sport.",
            };
        }

        const updatedEquipment = await prisma.equipment.update({
            where: { id },
            data: {
                name: data.name,
                quantity: data.quantity,
                trainingRoomId: data.trainingRoomId,
            },
        });

        return {
            success: true,
            message: "Équipement modifié.",
            equipment: updatedEquipment,
        };
    }

    async delete(id: number, userId: number, userRole: string) {
        const equipment = await prisma.equipment.findUnique({
            where: { id },
            include: {
                trainingRoom: {
                    include: { gym: true },
                },
            },
        });

        if (!equipment) {
            return {
                success: false,
                message: "Équipement introuvable.",
            };
        }

        if (userRole === "OWNER" && equipment.trainingRoom.gym.ownerId !== userId) {
            return {
                success: false,
                message: "Vous n'êtes pas propriétaire de cette salle de sport.",
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