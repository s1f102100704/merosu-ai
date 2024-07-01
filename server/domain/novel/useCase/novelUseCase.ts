import { load } from 'cheerio';
import { exec } from 'child_process';
import { decode } from 'iconv-lite';
import { transaction } from 'service/prismaClient';
//comand
const runCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};
export async function main(): Promise<string> {
  try {
    const result = await runCommand(
      'curl -X POST -H "Content-Type: application/json" -d \'{"aozoraUrl":"https://www.aozora.gr.jp/cards/000035/files/1567_14913.html"}\' http://localhost:31577/api/novel',
    );
    console.log('Command output:', result);
    // ここで結果を変数に代入
    const commandResult = result;
    return commandResult;
  } catch (error) {
    console.error(error);
    return 'error';
  }
}

export const novelUseCase = {
  scrape: (aozoraUrl: string): Promise<string> =>
    transaction('RepeatableRead', async (tx) => {
      const buffer = await fetch(aozoraUrl).then((b) => b.arrayBuffer());
      const html = decode(Buffer.from(buffer), 'shift-jis');
      const $ = load(html);

      return $('.main_text').text();
    }),
};
