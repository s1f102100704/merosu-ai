import type { FavoriteEntity } from 'api/@types/favorite';
import type { UserEntity } from 'api/@types/user';
import type { WorkEntity } from 'api/@types/work';
import { workMethod } from 'domain/work/model/workMethod';
import { transaction } from 'service/prismaClient';
import { favoriteCommand } from '../repository/favoriteCommand';

export const favoriteUseCase = {
  create: (user: UserEntity, work: WorkEntity): Promise<FavoriteEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const likedWork = await workMethod.createFav({ user, work });
      await favoriteCommand.save(tx, likedWork);
      return likedWork;
    }),
};
