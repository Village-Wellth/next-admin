import { options } from "@/options";
import { prisma } from "@/prisma";
import type { PrismaClient } from "@village-wellth/next-admin";
import { createHandler } from "@village-wellth/next-admin/pageHandler";

export const config = {
  api: {
    bodyParser: false,
  },
};

const { run } = createHandler<"nextadmin">({
  apiBasePath: "/api/pagerouter/admin",
  options,
  prisma: prisma as PrismaClient,
});

export default run;
