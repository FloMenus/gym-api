import { Request, Response, Router } from "express";
import { AuthService } from "../services";
import { loginSchema, promoteSchema, registerSchema } from "../schemas";
import { auth, authAdmin } from "../utils/auth";

export class AuthController {
  service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  async profile(req: Request, res: Response) {
    const response = await this.service.profile(req?.user?.userId ?? 0);

    if (response.success) {
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async login(req: Request, res: Response) {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    const response = await this.service.login(result.data);

    if (response.success) {
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async register(req: Request, res: Response) {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    const response = await this.service.register(result.data);

    if (response.success) {
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  async promoteToAdmin(req: Request, res: Response) {
    const result = promoteSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    const response = await this.service.promoteToAdmin(result.data);

    if (response.success) {
      return res.json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  buildRouter(): Router {
    const router = Router();
    router.get("/", auth, this.profile.bind(this));
    router.post("/login", this.login.bind(this));
    router.post("/register", this.register.bind(this));
    router.post("/promote", authAdmin, this.promoteToAdmin.bind(this));
    return router;
  }
}
