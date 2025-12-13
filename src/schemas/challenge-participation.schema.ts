import z from "zod";

export const challengeParticipationSchema = z.object({
    userId: z.number("L'identifiant de l'utilisateur est obligatoire."),
    challengeId: z.number("L'identifiant du challenge est obligatoire."),
});

export const challengeParticipationUpdateSchema = z.object({
    progress: z.number().min(0).max(100).optional(),
    caloriesBurned: z.number().min(0).optional(),
    completedAt: z.coerce.date().optional(),
});

export const challengeParticipationCompleteSchema = z.object({
    participationId: z.number("L'identifiant de la participation est obligatoire."),
});

export type challengeParticipationType = z.infer<typeof challengeParticipationSchema>;
export type challengeParticipationUpdateType = z.infer<typeof challengeParticipationUpdateSchema>;
export type challengeParticipationCompleteType = z.infer<typeof challengeParticipationCompleteSchema>;
