import z from "zod";

export const equipmentSchema = z.object({
    name: z.string("Le nom de l'équipement est obligatoire."),
    quantity: z.number("La quantité de l'équipement est obligatoire.").min(1, "La quantité doit être au moins de 1."),
    trainingRoomId: z.number("L'identifiant de la salle d'entraînement est obligatoire."),
});

export type equipmentType = z.infer<typeof equipmentSchema>;