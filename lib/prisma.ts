import { PrismaClient } from "@prisma/client";
import { log } from "console";

//this is a global variable that will be shared across all requests
const globalForPrisma = global as unknown as { prisma: PrismaClient };

//if prisma is already defined, use it, otherwise create a new instance
export const prisma = globalForPrisma.prisma || new PrismaClient({log: ['query']});

//if prisma is already defined, log a warning
//only do this in development, as it's not necessary in production
if (process.env.NODE_ENV === "development") {
  globalForPrisma.prisma = prisma;
}