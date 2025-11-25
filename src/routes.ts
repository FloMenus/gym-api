import { Router, Request, Response } from "express";
import auth from "./routes/auth";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Gym API is online !" });
});

router.use("/auth", auth);

router.get("/users", (req: Request, res: Response) => {
  res.json({ message: "Liste des utilisateurs" });
});

export default router;
