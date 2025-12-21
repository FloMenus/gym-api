import { Request, Response, Router } from "express";
import { ChallengeParticipationService } from "../services";
import { auth, authAdmin } from "../utils/auth";
import { 
    challengeParticipationSchema, 
    challengeParticipationUpdateSchema,
    challengeParticipationCompleteSchema,
} from "../schemas";

export class ChallengeParticipationController {
    service: ChallengeParticipationService;

    constructor() {
        this.service = new ChallengeParticipationService();
    }

    async getAll(req: Request, res: Response) {
        const response = await this.service.getAll();

        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async getByUserId(req: Request, res: Response) {
        const userId = Number(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID utilisateur invalide." });
        }

        const response = await this.service.getByUserId(userId);

        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async getByChallengeId(req: Request, res: Response) {
        const challengeId = Number(req.params.challengeId);

        if (isNaN(challengeId)) {
            return res.status(400).json({ message: "ID challenge invalide." });
        }

        const response = await this.service.getByChallengeId(challengeId);

        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async get(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide." });
        }

        const response = await this.service.get(id);

        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async create(req: Request, res: Response) {
        const result = challengeParticipationSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Vous n'êtes pas connecté." });
        }

        if (result.data.userId !== req.user.userId) {
            return res.status(403).json({ message: "Vous ne pouvez participer qu'en votre nom." });
        }

        const response = await this.service.create(result.data);

        if (response.success) {
            return res.status(201).json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide." });
        }

        const result = challengeParticipationUpdateSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Vous n'êtes pas connecté." });
        }

        const response = await this.service.update(id, result.data);

        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    async complete(req: Request, res: Response) {
        const result = challengeParticipationCompleteSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Vous n'êtes pas connecté." });
        }

        const response = await this.service.complete(result.data.participationId, req.user.userId);

        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    buildRouter(): Router {
        const router = Router();
        router.get("/", authAdmin, this.getAll.bind(this));
        router.get("/user/:userId", auth, this.getByUserId.bind(this));
        router.get("/challenge/:challengeId", this.getByChallengeId.bind(this));
        router.get("/:id", auth, this.get.bind(this));
        router.post("/", auth, this.create.bind(this));
        router.post("/complete", auth, this.complete.bind(this));
        router.put("/:id", auth, this.update.bind(this));
        return router;
    }
}
