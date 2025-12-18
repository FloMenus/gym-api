import { PrismaClient, UserRole } from "@prisma/client";
import { prisma } from "../src/utils/prisma";
import { registerSchema } from "../src/schemas";
import bcrypt from "bcrypt";

export class AdminScript {
    db: PrismaClient;

    constructor() {
        this.db = prisma;
    }

    async makeAdmin() {
        console.log("Creating admin user...");
        const emailInput = process.argv[2];
        const passwordInput = process.argv[3];
        const nameInput = process.argv[4];


        const result = registerSchema.safeParse({ email: emailInput, password: passwordInput, name: nameInput });

        if (!result.success) {
            console.error("Invalid input:", result.error);
            process.exit(1);
        }

        const existingUser = await this.db.user.findUnique({
            where: { email: emailInput },
        });

        if (existingUser) {
            console.error("An user with this email already exists.");
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(passwordInput, 10);
        await this.db.user.create({
            data: {
                email: emailInput,
                password: hashedPassword,
                role: UserRole.ADMIN,
                name: nameInput,
            },
        });
        
        console.log(`Admin created with email: ${emailInput}`);
        process.exit(0);
    }
}