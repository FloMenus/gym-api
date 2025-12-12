import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { challengeType } from "../schemas";

export class ChallengeService {
    db: PrismaClient;

    constructor() {
        this.db = prisma;
    }
}