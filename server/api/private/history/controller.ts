import { workQuery } from 'domain/work/repository/workQuery';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => workQuery.listAll(prismaClient).then((works) => ({ status: 200, body: works })),
}));
