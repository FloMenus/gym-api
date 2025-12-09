import { GymStatus } from "@prisma/client";
import z from "zod";

export const gymSchema = z.object({
    status: z.enum(GymStatus),
    name: z.string("Le nom de la salle de sport est obligatoire."),
    description: z.string("La description est obligatoire."),
    capacity: z.number().min(5, "La capacité doit être au moins de 5."),
    address: z.string("L'adresse est obligatoire."),
    phone: z.string("Le numéro de téléphone est obligatoire."),
    email: z.email("L'email doit être valide."),
    ownerId: z.number("L'identifiant du propriétaire est obligatoire."),
});

export type gymType = z.infer<typeof gymSchema>;