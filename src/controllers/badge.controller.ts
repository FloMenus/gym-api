import { Request, Response, Router } from "express";
import { BadgeService } from "../services";
import { auth, authAdmin } from "../utils/auth";
import { badgeSchema } from "../schemas";

export class BadgeController {
  service: BadgeService;

  constructor() {
    this.service = new BadgeService();
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
      return res.status(400);
    }

    const response = await this.service.get(id);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async getByUser(req: Request, res: Response) {
    if (!req.user) {
      return res.status(400);
    }

    const userId = req.user.userId;

    const response = await this.service.getByUser(userId);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async create(req: Request, res: Response) {
    const result = badgeSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
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
    const result = badgeSchema.safeParse(req.body);

    if (isNaN(id)) {
      return res.status(400);
    }

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    const response = await this.service.update(id, result.data);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400);
    }

    const response = await this.service.delete(id);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async execute(req: Request, res: Response) {
    const response = await this.service.execute();
    return res.json(response);
  }

  buildRouter(): Router {
    const router = Router();
    router.get("/", this.getAll.bind(this));
    router.get("/user", auth, this.getByUser.bind(this));
    router.get("/:id", this.get.bind(this));
    router.post("/", authAdmin, this.create.bind(this));
    router.put("/:id", authAdmin, this.update.bind(this));
    router.delete("/:id", authAdmin, this.delete.bind(this));
    router.post("/execute", authAdmin, this.execute.bind(this));
    return router;
  }
}
