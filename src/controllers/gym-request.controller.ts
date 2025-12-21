import { Request, Response, Router } from "express";
import { GymRequestService } from "../services";
import { authOwnerOrAdmin, authAdmin } from "../utils/auth";
import { gymRequestDecisionSchema, gymRequestSchema } from "../schemas";

export class GymRequestController {
  service: GymRequestService;

  constructor() {
    this.service = new GymRequestService();
  }

  async getAll(req: Request, res: Response) {
    const response = await this.service.getAll();

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
    const result = gymRequestSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Vous n'êtes pas connecté." });
    }

    const response = await this.service.create(result.data, req.user.userId);

    if (response.success) {
      return res.status(201).json(response); 
    } else {
      return res.status(400).json(response);
    }
  }

  async submitDecision(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const result = gymRequestDecisionSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Vous n'êtes pas connecté." });
    }

    const response = await this.service.submitDecision(result.data, id);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  buildRouter(): Router {
    const router = Router();
    router.post("/", authOwnerOrAdmin, this.create.bind(this));
    router.get("/", authAdmin, this.getAll.bind(this));
    router.get("/:id", authAdmin, this.get.bind(this));
    router.post("/submit-decision/:id", authAdmin, this.submitDecision.bind(this));
    return router;
  }
}

