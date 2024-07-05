import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from '../apiClient';
import { GET, POST } from '../utils';

test(GET(noCookieClient.private.works), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.works.$get();
  expect(res).toHaveLength(0);
});

test(
  POST(noCookieClient.private.works),
  async () => {
    const userClient = await createUserClient();
    const novelUrl = 'https://www.aozora.gr.jp/cards/000311/files/4180_14772.html';
    await userClient.private.works.$post({ body: { novelUrl } });
    console.log(0);
    //eslint-disable-next-line no-constant-condition
    while (true) {
      const res = await userClient.private.works.$get();

      if (res[0].status !== 'loading') {
        expect(res[0].status).toBe('completed');

        expect(res[0].novelUrl).toBe(novelUrl);

        expect(res[0].title).toBe('声');

        expect(res[0].author).toBe('宮本百合子');

        break;
      }
    }
  },
  300_000,
);
