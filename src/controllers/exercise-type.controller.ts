import { Request, Response, Router } from "express";
import { ExerciseTypeService } from "../services";
import { auth, authAdmin } from "../utils/auth";
import { exerciseTypeSchema } from "../schemas";

export class ExerciseTypeController {
  service: ExerciseTypeService;

  constructor() {
    this.service = new ExerciseTypeService();
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
      return res.status(400);
    }

    const response = await this.service.get(id);

    if (response.success) {
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async create(req: Request, res: Response) {
    console.log(req.body);
    const result = exerciseTypeSchema.safeParse(req.body);

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

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = exerciseTypeSchema.safeParse(req.body);

    if (isNaN(id)) {
      return res.status(400);
    }

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    const response = await this.service.update(id, result.data);

    if (response.success) {
      return res.json(response);
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
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  buildRouter(): Router {
    const router = Router();
    router.get("/", auth, this.getAll.bind(this));
    router.get("/:id", auth, this.get.bind(this));
    router.post("/", authAdmin, this.create.bind(this));
    router.put("/:id", authAdmin, this.update.bind(this));
    router.delete("/:id", authAdmin, this.delete.bind(this));
    return router;
  }
}
