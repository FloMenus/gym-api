import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Gym API is online !' });
});

async function main(): Promise<void> {
  try {
    console.log('Starting API...');

    // Test database connection
    await prisma.$connect();
    console.log('Database connection OK');

    // Start server
    const server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      console.log('API is ready!');
    });

    // Server error handling
    server.on('error', (error) => {
      console.error('Server Errors:', error);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server...');
      server.close(() => {
        prisma.$disconnect();
      });
    });
    
  } catch (error) {
    console.error('Errors in main:', error);
    process.exit(1);
  }
}

main();