import z from "zod";

export const registerSchema = z.object({
  email: z.email("L'email est obligatoire."),
  password: z.string("Le mot de passe est obligatoire."),
  name: z.string("Le nom d'utilisateur est obligatoire."),
});

export type registerType = z.infer<typeof registerSchema>;
