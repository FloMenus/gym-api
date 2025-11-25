import { Router, Request, Response } from "express";
import { registerSchema } from "./../schemas/register";
import { register } from "./../auth/register";
import { loginSchema } from "../schemas/login";
import { login } from "../auth/login";
import { auth } from "./../utils/auth";
import { profil } from "../auth/profil";

const router = Router();

router.get("/", auth, async (req: Request, res: Response) => {
  const response = await profil(req?.user?.userId ?? 0);

  if (response.success) {
    return res.json(response);
  } else {
    return res.status(400).json(response);
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error });
  }

  const response = await register(result.data);

  if (response.success) {
    return res.json(response);
  } else {
    return res.status(400).json(response);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error });
  }

  const response = await login(result.data);

  if (response.success) {
    return res.json(response);
  } else {
    return res.status(400).json(response);
  }
});

export default router;
