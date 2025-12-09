import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { exerciseTypeType } from "../schemas";
import { success } from "zod";

export class ExerciseTypeService {
  db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async getAll() {
    const exerciseTypes = await prisma.exerciseType.findMany();

    return {
      success: true,
      exerciseTypes,
    };
  }

  async get(id: number) {
    const exerciseType = await prisma.exerciseType.findUnique({
      where: { id },
    });

    if (!exerciseType) {
      return {
        success: false,
        message: "Type d'exercice introuvable.",
      };
    }

    return {
      success: true,
      exerciseType,
    };
  }

  async create(data: exerciseTypeType) {
    const exerciseType = await prisma.exerciseType.create({
      data,
    });

    return {
      success: true,
      message: "Type d'exercice créé.",
      exerciseType,
    };
  }

  async update(id: number, data: exerciseTypeType) {
    const exerciseTypeExist = await prisma.exerciseType.findFirst({
      where: { id },
    });

    if (!exerciseTypeExist) {
      return {
        success: false,
        message: "Type d'exercice introuvable.",
      };
    }

    const exerciseType = await prisma.exerciseType.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: "Type d'exercice modifié.",
      exerciseType,
    };
  }

  async delete(id: number) {
    const exerciseTypeExist = await prisma.exerciseType.findFirst({
      where: { id },
    });

    if (!exerciseTypeExist) {
      return {
        success: false,
        message: "Type d'exercice introuvable.",
      };
    }

    await prisma.exerciseType.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Type d'exercice supprimé.",
    };
  }
}
