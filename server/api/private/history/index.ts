import type { HistoryEntity } from 'api/@types/history';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: HistoryEntity[];
  };
}>;
