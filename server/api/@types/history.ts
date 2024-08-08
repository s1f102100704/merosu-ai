import type { EntityId } from './brandedId';

export type HistoryEntity = {
  id: EntityId['history'];
  novelUrl: string;
  title: string;
  author: string;
  createdTime: string;
};
