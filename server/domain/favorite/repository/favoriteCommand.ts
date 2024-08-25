import type { Prisma } from '@prisma/client';
import type { FavoriteEntity } from 'api/@types/favorite';

export const favoriteCommand = {
  save: async (tx: Prisma.TransactionClient, favorite: FavoriteEntity): Promise<void> => {
    await tx.favorite.upsert({
      where: { id: favorite.id },
      update: {},
      create: {
        id: favorite.id,
        createdAt: new Date(favorite.createdTime),
        authorId: favorite.user.id,
        workId: favorite.workId.id,
      },
    });
  },
};
