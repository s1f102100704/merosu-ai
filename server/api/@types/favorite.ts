import type { EntityId } from './brandedId';
import type { WorkEntity } from './work';

export type FavoriteEntity = {
  id: EntityId['favorite'];
  authorId: { id: EntityId['user']; signInName: string };
  workId: { id: EntityId['work'] };
  createdTime: number;
};

export type favCreateVal = { user: { id: EntityId['user']; signInName: string }; work: WorkEntity };
