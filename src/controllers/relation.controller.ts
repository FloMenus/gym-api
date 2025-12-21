import { Request, Response, Router } from "express";
import { RelationService } from "../services";
import { auth } from "../utils/auth";
import { editRelationSchema, relationSchema } from "../schemas";

export class RelationController {
  service: RelationService;

  constructor() {
    this.service = new RelationService();
  }

  async getRelation(req: Request, res: Response) {
    if (!req.user) {
      return res.status(400);
    }

    const userId = req.user.userId;

    const response = await this.service.getRelation(userId);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async getAcceptRelation(req: Request, res: Response) {
    if (!req.user) {
      return res.status(400);
    }

    const userId = req.user.userId;

    const response = await this.service.getAcceptRelation(userId);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async getPendingRelation(req: Request, res: Response) {
    if (!req.user) {
      return res.status(400);
    }

    const userId = req.user.userId;

    const response = await this.service.getPendingRelation(userId);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async send(req: Request, res: Response) {
    if (!req.user) {
      return res.status(400);
    }

    const userId = req.user.userId;

    const result = relationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    const response = await this.service.send(userId, result.data);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async edit(req: Request, res: Response) {
    if (!req.user) {
      return res.status(400);
    }

    const userId = req.user.userId;

    const result = editRelationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    const response = await this.service.edit(userId, result.data);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async delete(req: Request, res: Response) {
    if (!req.user) {
      return res.status(400);
    }

    const userId = req.user.userId;

    const result = relationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    const response = await this.service.delete(userId, result.data);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  buildRouter(): Router {
    const router = Router();
    router.get("/", auth, this.getRelation.bind(this));
    router.get("/accept", auth, this.getAcceptRelation.bind(this));
    router.get("/pending", auth, this.getPendingRelation.bind(this));
    router.post("/", auth, this.send.bind(this));
    router.put("/", auth, this.edit.bind(this));
    router.delete("/", auth, this.delete.bind(this));
    return router;
  }
}
