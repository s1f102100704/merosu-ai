import type { LoadingWorkEntity } from 'api/@types/work';
import { transaction } from 'service/prismaClient';

export const historyUseCase = {
  complete: (loadingWork: LoadingWorkEntity, image: Buffer): Promise<void> =>
    transaction('RepeatableRead', async (tx) => {}),
};
