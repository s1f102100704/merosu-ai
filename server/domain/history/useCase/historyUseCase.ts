import type { LoadingWorkEntity } from 'api/@types/work';
import { workEvent } from 'domain/work/event/workEvent';
import { transaction } from 'service/prismaClient';
import { historyMethod } from '../model/historyMethod';
import { historyCommand } from '../repository/historyCommand';

export const historyUseCase = {
  complete: (loadingWork: LoadingWorkEntity, image: Buffer): Promise<void> =>
    transaction('RepeatableRead', async (tx) => {
      const completedWork = await historyMethod.complete(loadingWork);
      await historyCommand.save(tx, completedWork);
      workEvent.workLoaded(completedWork);
    }),
};
