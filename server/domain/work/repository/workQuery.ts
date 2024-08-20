import type { History, Prisma, Work } from '@prisma/client';
import { WORK_STATUSES } from 'api/@constants';
import type { HistoryEntity } from 'api/@types/history';
import type { WorkEntity } from 'api/@types/work';
import { getContentKeyHis, getImageKeyHis } from 'domain/history/service/getS3Key';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import { z } from 'zod';
import { getContentKey, getImageKey } from '../service/getS3Key';

const toWorkEntity = async (prismaWork: Work): Promise<WorkEntity> => {
  const id = brandedId.work.entity.parse(prismaWork.id);
  const status = z.enum(WORK_STATUSES).parse(prismaWork.status);
  const contentUrl = await s3.getSignedUrl(getContentKey(id));
  switch (status) {
    case 'loading':
      return {
        id,
        status,
        novelUrl: prismaWork.novelUrl,
        title: prismaWork.title,
        author: prismaWork.author,
        createdTime: prismaWork.createdAt.getTime(),
        contentUrl,
        imageUrl: null,
        errorMsg: null,
      };
    case 'completed':
      return {
        id,
        status,
        novelUrl: prismaWork.novelUrl,
        title: prismaWork.title,
        author: prismaWork.author,
        createdTime: prismaWork.createdAt.getTime(),
        contentUrl,
        imageUrl: await s3.getSignedUrl(getImageKey(id)),
        errorMsg: null,
      };

    case 'failed':
      return {
        id,
        status,
        novelUrl: prismaWork.novelUrl,
        title: prismaWork.title,
        author: prismaWork.author,
        createdTime: prismaWork.createdAt.getTime(),
        contentUrl,
        imageUrl: null,
        errorMsg: z.string().parse(prismaWork.errorMsg),
      };
    /* v8 ignore next 2 */
    default:
      throw new Error(status satisfies never);
  }
};

const toHistoryEntity = async (prismaWork: History): Promise<HistoryEntity> => {
  const id = brandedId.history.entity.parse(prismaWork.id);
  const contentUrl = await s3.getSignedUrl(getContentKeyHis(id));
  return {
    id,
    status: 'completed',
    novelUrl: prismaWork.novelUrl,
    title: prismaWork.title,
    author: prismaWork.author,
    createdTime: prismaWork.createdAt.getTime(),
    contentUrl,
    imageUrl: await s3.getSignedUrl(getImageKeyHis(id)),
    errorMsg: null,
  };
};

export const workQuery = {
  listAll: (tx: Prisma.TransactionClient): Promise<HistoryEntity[]> =>
    tx.history
      .findMany({ orderBy: { createdAt: 'desc' } })
      .then((works) => Promise.all(works.map(toHistoryEntity))),

  // リストの更新
  listReload: (tx: Prisma.TransactionClient): Promise<WorkEntity[]> =>
    tx.work.findMany({ orderBy: { createdAt: 'desc' }, skip: 3 }).then(async (works) => {
      const idsToDelete = works.map((work) => work.id);
      if (idsToDelete.length > 0) {
        await tx.work.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      // 残りの最新3件を取得
      const latestWorks = await tx.work.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
      });
      return Promise.all(latestWorks.map(toWorkEntity));
    }),
  // likeList: (tx: Prisma.TransactionClient, likedWork: WorkEntity): Promise<WorkEntity[]> =>
  //   tx.work
  //     .findFirst({
  //       where: { id: likedWork.id },
  //     })
  //     .then(),
};
