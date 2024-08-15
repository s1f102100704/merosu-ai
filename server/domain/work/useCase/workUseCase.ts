import type { LoadingWorkEntity } from 'api/@types/work';

import type { HistoryEntity } from 'api/@types/history';
import { historyCommand } from 'domain/history/repository/historyCommand';
import { getContentKeyHis, getImageKeyHis } from 'domain/history/service/getS3Key';
import { transaction } from 'service/prismaClient';
import { s3 } from 'service/s3Client';
import { workEvent } from '../event/workEvent';
import { workMethod } from '../model/workMethod';
import { novelQuery } from '../repository/novelQuery';
import { workCommand } from '../repository/workCommand';
import { getContentKey, getImageKey } from '../service/getS3Key';
export const workUseCase = {
  create: (novelUrl: string): Promise<LoadingWorkEntity> =>
    transaction('RepeatableRead', async (tx) => {
      console.log(1);
      const { title, author, html } = await novelQuery.scrape(novelUrl);
      const loadingWork = await workMethod.create({ novelUrl, title, author });
      const hisWork = await workMethod.crehis({ novelUrl, title, author });

      await workCommand.save(tx, loadingWork);
      await historyCommand.save(tx, hisWork);

      await s3.putText(getContentKey(loadingWork.id), html);
      await s3.putText(getContentKeyHis(hisWork.id), html);

      workEvent.workCreated({ loadingWork, hisWork, html });
      return loadingWork;
    }),
  compHis: (hisWork: HistoryEntity, image: Buffer): Promise<void> =>
    transaction('RepeatableRead', async (tx) => {
      const compHis = await workMethod.comphis(hisWork);
      await historyCommand.save(tx, compHis);
      await s3.putImage(getImageKeyHis(hisWork.id), image);
      workEvent.workLoaded(compHis);
    }),

  complete: (loadingWork: LoadingWorkEntity, image: Buffer): Promise<void> =>
    transaction('RepeatableRead', async (tx) => {
      const completedWork = await workMethod.complete(loadingWork);

      await workCommand.save(tx, completedWork);
      await s3.putImage(getImageKey(loadingWork.id), image);

      workEvent.workLoaded(completedWork);
    }),
  failure: (loadingWork: LoadingWorkEntity, errorMsg: string): Promise<void> =>
    transaction('ReadCommitted', async (tx) => {
      const failedWork = workMethod.failure(loadingWork, errorMsg);
      await workCommand.save(tx, failedWork);
      workEvent.workLoaded(failedWork);
    }),
};
