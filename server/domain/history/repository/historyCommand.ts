import type { Prisma } from '@prisma/client';
import type { HistoryEntity } from 'api/@types/history';

export const historyCommand = {
  save: async (tx: Prisma.TransactionClient, history: HistoryEntity): Promise<void> => {
    await tx.history.upsert({
      where: { id: history.id },
      update: { status: history.status, errorMsg: history.errorMsg },
      create: {
        id: history.id,
        title: history.title,
        author: history.author,
        novelUrl: history.novelUrl,
        status: history.status,
        errorMsg: history.errorMsg,
        createdAt: new Date(history.createdTime),
      },
    });
  },
};
