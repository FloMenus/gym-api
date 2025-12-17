import { Request, Response, Router } from "express";
import { ChallengeService } from "../services";
import { challengeSchema } from "../schemas";

export class ChallengeController {
    service: ChallengeService;

    constructor() {
        this.service = new ChallengeService();
    }

    async create(req: Request, res: Response) {
        const result = challengeSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error });
        }

        const response = await this.service.create(result.data);

        if (response.success) {
            return res.json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    buildRouter(): Router {
        const router = Router();
        router.post("/", this.create.bind(this));
        return router;
    }
}