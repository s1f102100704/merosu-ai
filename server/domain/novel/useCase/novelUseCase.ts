import { transaction } from 'service/prismaClient';
//test
export const novelUseCase = {
  scrape: (aozoraUrl: string): Promise<string> =>
    transaction('RepeatableRead', async (tx) => {
      return aozoraUrl;
    }),
};
