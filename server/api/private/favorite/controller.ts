import { favoriteUseCase } from 'domain/favorite/useCase/favoriteUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: ({ body }) => favoriteUseCase.create(body).then((work) => ({ status: 200, body: work })),
}));
