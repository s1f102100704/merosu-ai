import { ask } from 'domain/openai/useCase/openai';
import { defineController } from './$relay';
export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: async () => ({ status: 200, body: await ask() }),
}));
