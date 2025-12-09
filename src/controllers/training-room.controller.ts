import { Request, Response, Router } from "express";
import { TrainingRoomService } from "../services";
import { authOwner, authAdmin, authOwnerOrAdmin } from "../utils/auth";
import { trainingRoomSchema, trainingRoomUpdateSchema } from "../schemas";

export class TrainingRoomController {
    service: TrainingRoomService;

    constructor() {
        this.service = new TrainingRoomService();
    }

    async getAll(req: Request, res: Response) {
        const response = await this.service.getAll();

        if (response.success) {
            return res.json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async getByGymId(req: Request, res: Response) {
        const gymId = Number(req.params.gymId);

        if (isNaN(gymId)) {
            return res.status(400).json({ message: "ID de salle de sport invalide." });
        }

        const response = await this.service.getByGymId(gymId);

        if (response.success) {
            return res.json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async getByExerciseTypeId(req: Request, res: Response) {
        const exerciseTypeId = Number(req.params.exerciseTypeId);

        if (isNaN(exerciseTypeId)) {
            return res.status(400).json({ message: "ID de type d'exercice invalide." });
        }

        const response = await this.service.getByExerciseTypeId(exerciseTypeId);

        if (response.success) {
            return res.json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async create(req: Request, res: Response) {
        const result = trainingRoomSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Vous n'êtes pas connecté." });
        }

        const gymId = Number(req.body.gymId);
        if (isNaN(gymId)) {
            return res.status(400).json({ message: "ID de salle de sport invalide." });
        }

        const response = await this.service.create(result.data);

        if (response.success) {
            return res.json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async update(req: Request, res: Response) {
        const result = trainingRoomUpdateSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Vous n'êtes pas connecté." });
        }

        const response = await this.service.update(result.data);

        if (response.success) {
            return res.json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    buildRouter(): Router {
        const router = Router();
        router.get("/", this.getAll.bind(this));
        router.get("/gym/:gymId", this.getByGymId.bind(this));
        router.get("/exercise-type/:exerciseTypeId", this.getByExerciseTypeId.bind(this));
        router.post("/", authOwnerOrAdmin, this.create.bind(this));
        router.put("/", authOwnerOrAdmin, this.update.bind(this));
        return router;
    }
}