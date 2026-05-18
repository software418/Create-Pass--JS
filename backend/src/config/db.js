import { PrismaClient } from "@prisma/client";
const logger = (await import('../utils/logger.utils.js')).default || (await import('../utils/logger.utils.js')).default;
const prisma = new PrismaClient();
const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info(`MySQL Database Connected via Prisma`);
  } catch (error) {
    logger.error(`Error connecting to MySQL: ${error.message}`);
    process.exit(1);
  }
};
export { connectDB, prisma };