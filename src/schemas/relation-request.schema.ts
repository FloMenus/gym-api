import z from "zod";

export const relationSchema = z.object({
  email: z.email("L'email est obligatoire."),
});

export const editRelationSchema = z.object({
  email: z.email("L'email est obligatoire."),
  status: z.enum(["ACCEPT", "REJECT"]),
});

export type relationType = z.infer<typeof relationSchema>;

export type editRelationType = z.infer<typeof editRelationSchema>;
