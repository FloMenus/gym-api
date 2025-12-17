import { ChallengeDifficulty } from "@prisma/client";
import z from "zod";

export const challengeSchema = z.object({
  title: z.string("Le titre du défi est obligatoire."),
  description: z.string("La description du défi est obligatoire.").optional(),
  challengeExercises: z.string("Les exercices du défi sont obligatoires.").optional(),
  duration: z.number("La durée est obligatoire.").int().positive().optional(),
  difficulty: z.nativeEnum(ChallengeDifficulty, {
    errorMap: () => ({ message: "La difficulté doit être EASY, MEDIUM ou HARD." }),
  }).optional(),
  exerciseTypeNames: z.array(z.string()).min(1, "Au moins un type d'exercice est obligatoire."),
  gymId: z.number("L'identifiant de la salle de sport est obligatoire.").int().positive().optional(),
  equipmentNames: z.array(z.string()).min(1, "Au moins un équipement est obligatoire pour un défi lié à une salle.").optional(),
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
      return data.equipmentNames !== undefined && data.equipmentNames.length > 0;
    }
    return true;
  },
  {
    message: "Pour un défi lié à une salle (gymId), les équipements sont obligatoires.",
  }
);

export type challengeType = z.infer<typeof challengeSchema>;
