import { workQuery } from 'domain/work/repository/workQuery';
import { workUseCase } from 'domain/work/useCase/workUseCase';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => workQuery.listReload(prismaClient).then((works) => ({ status: 200, body: works })),
  // .listReload(prismaClient)

  // post: ({ user, body }) =>
  //   workUseCase.create(user, body.novelUrl).then((work) => ({ status: 200, body: user, work })),

  post: {
    handler: async ({ user, body }) => ({
      status: 200,
      body: await workUseCase.create(user, body.novelUrl),
    }),
  },
}));
// workQuery.listReload(prismaClient).then((works) => ({ status: 200, body: works }));
