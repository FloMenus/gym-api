import { Request, Response, Router } from "express";
import { GymService } from "../services";
import { authAdmin } from "../utils/auth";
import { gymSchema } from "../schemas";

export class GymController {
    service : GymService;

    constructor() {
        this.service = new GymService();
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
        const result = gymSchema.safeParse(req.body);

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
        const result = gymSchema.safeParse(req.body);

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
        router.get("/", authAdmin, this.getAll.bind(this));
        router.get("/:id", this.get.bind(this));
        router.post("/", this.create.bind(this));
        router.put("/:id", this.update.bind(this));
        router.delete("/:id", this.delete.bind(this));
        return router;
    }
}