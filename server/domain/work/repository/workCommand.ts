import type { Prisma } from '@prisma/client';
import type { HistoryEntity } from 'api/@types/history';
import type { WorkEntity } from 'api/@types/work';

////////このファイルでprisma に登録している疑惑がある
export const workCommand = {
  save: async (tx: Prisma.TransactionClient, work: WorkEntity): Promise<void> => {
    await tx.work.upsert({
      where: { id: work.id },
      update: { status: work.status, errorMsg: work.errorMsg },
      create: {
        id: work.id,
        title: work.title,
        author: work.author,
        novelUrl: work.novelUrl,
        status: work.status,
        errorMsg: work.errorMsg,
        createdAt: new Date(work.createdTime),
      },
    });
  },
  allsave: async (tx: Prisma.TransactionClient, work: HistoryEntity): Promise<void> => {
    await tx.work.upsert({
      where: { id: work.id },
      update: { status: work.status, errorMsg: work.errorMsg },
      create: {
        id: work.id,
        title: work.title,
        author: work.author,
        novelUrl: work.novelUrl,
        createdAt: new Date(work.createdTime),
      },
    });
  },
};
