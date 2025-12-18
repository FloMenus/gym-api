import { Router, Request, Response } from "express";
import {
  AuthController,
  ExerciseTypeController,
  GymController,
  GymRequestController,
  EquipmentController,
  TrainingRoomController,
  ChallengeController,
  ChallengeParticipationController,
  BadgeController,
  RelationController,
} from "./controllers";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Gym API is online !" });
});

const authController = new AuthController();
router.use("/auth", authController.buildRouter());

const exerciseTypeController = new ExerciseTypeController();
router.use("/exerciseType", exerciseTypeController.buildRouter());

const gymController = new GymController();
router.use("/gym", gymController.buildRouter());

const equipmentController = new EquipmentController();
router.use("/equipment", equipmentController.buildRouter());

const gymRequestController = new GymRequestController();
router.use("/gym-request", gymRequestController.buildRouter());

const trainingRoomController = new TrainingRoomController();
router.use("/training-room", trainingRoomController.buildRouter());

const challengeController = new ChallengeController();
router.use("/challenge", challengeController.buildRouter());

const challengeParticipationController = new ChallengeParticipationController();
router.use(
  "/challenge-participation",
  challengeParticipationController.buildRouter()
);

const badgeController = new BadgeController();
router.use("/badge", badgeController.buildRouter());

const relationController = new RelationController();
router.use("/relation", relationController.buildRouter());

export default router;
