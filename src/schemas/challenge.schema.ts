import { ChallengeDifficulty } from "@prisma/client";
import e from "express";
import z from "zod";

export const challengeSchema = z.object({
  title: z.string("Le titre du défi est obligatoire."),
  description: z.string("La description du défi est obligatoire."),
  duration: z.number("La durée est obligatoire.").int(),
  difficulty: z.enum(ChallengeDifficulty, {
    error: () => ({ message: "La difficulté doit être EASY, MEDIUM ou HARD." }),
  }),
  deadline: z.coerce.date({ message: "La date limite du défi est obligatoire." }),
  gymId: z.number("L'identifiant de la salle de sport est obligatoire."),
  challengeExercises: z.string("Les exercices du défi sont obligatoires."),
  equipmentIds: z.array(z.number()).min(1, "Au moins un équipement est obligatoire pour un défi lié à une salle."),
  exerciseTypeIds: z.array(z.number()).min(1, "Au moins un type d'exercice est obligatoire pour le défi."),
}).refine(
  (data) => {
    return data.challengeExercises !== undefined && data.challengeExercises.length > 0;
  },
  {
    message: "La description des exercices est obligatoire.",
  }
).refine(
  (data) => {
    if (data.gymId) {
      return data.equipmentIds !== undefined && data.equipmentIds.length > 0;
    }
    return true;
  },
  {
    message: "Pour un défi lié à une salle (gymId), les équipements sont obligatoires.",
  }
);

export type challengeType = z.infer<typeof challengeSchema>;
