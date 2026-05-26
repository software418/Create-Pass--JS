import { prisma } from "../../config/db.js";
import logger from "../../utils/logger.utils.js";

export const getReportPassesService = async (filters = {}) => {
  try {
    return await prisma.formData.findMany({
      where: filters,
      include: {
        persons: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (err) {
    logger.error(`getReportPassesService error: ${err.message}`);
    throw err;
  }
};
