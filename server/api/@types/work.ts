import type { EntityId } from './brandedId';

type WorkBase = {
  id: EntityId['work'];
  status: 'loading';
  novelUrl: string;
  title: string;
  author: string;
  createdTime: number;
};
export type LoadingWorkEntity = WorkBase & {
  status: 'loading';
  imageUrl: null;
  errorMsg: null;
};
export type CompletedWorkEntity = WorkBase & {
  status: 'completed';
  imageUrl: string;
  errotMsg: null;
};
export type FailedWorkEntity = WorkBase & {
  status: 'failed';
  imageUrl: null;
  errotMsg: string;
};
export type WorkEntity = LoadingWorkEntity | CompletedWorkEntity | FailedWorkEntity;
