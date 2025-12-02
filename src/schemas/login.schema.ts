import z from "zod";

export const loginSchema = z.object({
  email: z.email("L'email est obligatoire."),
  password: z.string("Le mot de passe est obligatoire."),
});

export type loginType = z.infer<typeof loginSchema>;
