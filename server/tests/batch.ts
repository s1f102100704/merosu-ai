import { novelQuery } from 'domain/work/repository/novelQuery';
import { writeFileSync } from 'fs';
import { basename, join } from 'path';

const main = async (): Promise<void> => {
  const novelUrl = 'https://www.aozora.gr.jp/cards/000311/files/4180_14772.html';

  const { html } = await novelQuery.scrape(novelUrl);
  const filePath = join(__dirname, 'www.aozora.gr.jp/files', basename(novelUrl));
  writeFileSync(filePath, html, 'utf8');
};
main();
