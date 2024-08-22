import type { FavoriteEntity } from 'api/@types/favorite';
import type { WorkEntity } from 'api/@types/work';
import { workMethod } from 'domain/work/model/workMethod';
import { transaction } from 'service/prismaClient';
import { favoriteCommand } from '../repository/favoriteCommand';

export const favoriteUseCase =  {
  create:(work: WorkEntity): Promise<FavoriteEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const likedWork = await workMethod.creFav(work);
      await favoriteCommand.save(tx, work);
    });
};
