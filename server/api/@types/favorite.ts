import type { EntityId } from './brandedId';

export type FavoriteEntity = {
  id: EntityId['favorite'];
  authorId: { id: EntityId['user']; signInName: string };
  workId: { id: EntityId['work'] };
  createdTime: number;
};
