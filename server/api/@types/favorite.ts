import type { EntityId } from './brandedId';

export type FavoriteEntity = {
  id: EntityId['favorite'];
  authorId: string;
  workId: string;
};
