import { GymRequestStatus } from "@prisma/client";
import z from "zod";

export const gymSchema = z.object({
    status: z.enum(GymRequestStatus),
    name: z.string("Le nom de la salle de sport est obligatoire."),
    description: z.string("La description est obligatoire."),
    address: z.string("L'adresse est obligatoire."),
    phone: z.string("Le numéro de téléphone est obligatoire."),
    email: z.email("L'email doit être valide."),
    equipmentDescription: z.string("La description des équipements est obligatoire."),
    exerciseTypes: z.string("La description des types d'activités est obligatoire."),
    ownerId: z.number("L'identifiant du propriétaire est obligatoire."),
});

export type gymType = z.infer<typeof gymSchema>;