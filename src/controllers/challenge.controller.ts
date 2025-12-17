import { Request, Response, Router } from "express";
import { ChallengeService } from "../services";
import { auth, authAdmin, authOwnerOrAdmin } from "../utils/auth";
import { challengeSchema } from "../schemas";

export class ChallengeController {
  service: ChallengeService;

  constructor() {
    this.service = new ChallengeService();
  }

  async getAll(req: Request, res: Response) {
    const response = await this.service.getAll();

    if (response.success) {
      return res.json(response);
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
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async create(req: Request, res: Response) {
    const result = challengeSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Vous n'êtes pas connecté." });
    }

    const response = await this.service.create(
      result.data,
      req.user.userId,
      req.user.role
    );

    if (response.success) {
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = challengeSchema.safeParse(req.body);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Vous n'êtes pas connecté." });
    }

    const response = await this.service.update(
      id,
      result.data,
      req.user.userId,
      req.user.role
    );

    if (response.success) {
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Vous n'êtes pas connecté." });
    }

    const response = await this.service.delete(
      id,
      req.user.userId,
      req.user.role
    );

    if (response.success) {
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  buildRouter(): Router {
    const router = Router();
    router.get("/", auth, this.getAll.bind(this));
    router.get("/:id", auth, this.get.bind(this));
    router.post("/", auth, this.create.bind(this));
    router.put("/:id", auth, this.update.bind(this));
    router.delete("/:id", auth, this.delete.bind(this));
    return router;
  }
}

