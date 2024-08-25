import { favoriteUseCase } from 'domain/favorite/useCase/favoriteUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: {
    handler: async ({ user, body }) => ({
      status: 200,
      body: await favoriteUseCase.create(user, body),
    }),
  },
}));
