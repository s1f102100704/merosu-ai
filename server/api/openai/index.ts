import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: string;
  };
  post: {
    reqBody: { messages: string; model: string };
    resBosy: string;
  };
}>;
