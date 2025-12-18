import z from "zod";

export const trainingRoomSchema = z.object({
    name: z.string("Le nom de la salle d'entraînement est obligatoire."),
    capacity: z.number().min(1, "La capacité doit être au moins de 1."),
    gymId: z.number("L'ID de la salle de sport est obligatoire."),
    exerciseTypeIds: z.array(z.int("Les ID de type d'exercices sont obligatoires.")).min(1, "Au moins un type d'exercice doit être spécifié."),
});

export const trainingRoomUpdateSchema = z.object({
    id: z.number("L'ID de la salle d'entraînement est obligatoire."),
    name: z.string("Le nom de la salle d'entraînement est obligatoire."),
    capacity: z.number().min(1, "La capacité doit être au moins de 1."),
    gymId: z.number("L'ID de la salle de sport est obligatoire."),
    exerciseTypeIds: z.array(z.int("Les ID de type d'exercices sont obligatoires.")).min(1, "Au moins un type d'exercice doit être spécifié."),
});

export type trainingRoomType = z.infer<typeof trainingRoomSchema>;
export type trainingRoomUpdateType = z.infer<typeof trainingRoomUpdateSchema>;