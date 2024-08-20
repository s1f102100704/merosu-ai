import type { WorkEntity } from 'api/@types/work';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: string;
  };
  post: {
    reqBody: WorkEntity;
    resBody: WorkEntity;
  };
}>;
