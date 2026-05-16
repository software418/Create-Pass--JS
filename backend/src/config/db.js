const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger.utils').default || require('../utils/logger.utils');

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

module.exports = { connectDB, prisma };
