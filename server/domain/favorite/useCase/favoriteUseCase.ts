import type { FavoriteEntity } from 'api/@types/favorite';
import type { WorkEntity } from 'api/@types/work';
import { transaction } from 'service/prismaClient';

export const favoriteUseCase = () => {
  (work: WorkEntity): Promise<FavoriteEntity> => transaction('RepeatableRead', async (tx) => {});
};
