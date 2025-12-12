import { Request, Response, Router } from "express";
import { ChallengeService } from "../services";
import { auth } from "../utils/auth";
import { challengeSchema } from "../schemas";

export class ChallengeController {
    service: ChallengeService;

    constructor() {
        this.service = new ChallengeService();
    }

    buidlRouter(): Router {
        const router = Router();
        return router;
    }
}