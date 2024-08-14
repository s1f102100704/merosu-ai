import type { WORK_STATUSES } from 'api/@constants';
import type { EntityId } from './brandedId';

export type HistoryEntity = {
  id: EntityId['history'];
  novelUrl: string;
  title: string;
  author: string;
  contentUrl: string;
  createdTime: number;
  status: (typeof WORK_STATUSES)[1];
  imageUrl: string;
  errorMsg: null;
};
