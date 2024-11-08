import { PrismaClient } from "@prisma/client";
import { logger } from "./logging";

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e: unknown) => {
  logger.info(e);
});

prisma.$on("error", (e: unknown) => {
  logger.error(e);
});

prisma.$on("info", (e: unknown) => {
  logger.info(e);
});

prisma.$on("warn", (e: unknown) => {
  logger.warn(e);
});
