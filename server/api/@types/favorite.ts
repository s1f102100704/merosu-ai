import type { EntityId } from './brandedId';

export type FavoriteEntity = {
  id: EntityId['favorite'];
  user: { id: EntityId['user']; signInName: string };
  workId: { id: EntityId['work'] };
  createdTime: number;
};
