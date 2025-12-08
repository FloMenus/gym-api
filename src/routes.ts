import { Router, Request, Response } from "express";
import { AuthController, ExerciseTypeController, GymRequestController } from "./controllers";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Gym API is online !" });
});

const authController = new AuthController();

router.use("/auth", authController.buildRouter());

const exerciseTypeController = new ExerciseTypeController();

router.use("/exerciseType", exerciseTypeController.buildRouter());

const gymRequestController = new GymRequestController();

router.use("/gymRequest", gymRequestController.buildRouter());

export default router;
