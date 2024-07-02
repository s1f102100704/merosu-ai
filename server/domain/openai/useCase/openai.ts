import { main } from 'domain/novel/useCase/novelUseCase';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  dangerouslyAllowBrowser: true, // ***注意*** クライアントサイドの実行を許可
});
export async function ask(): Promise<string> {
  // メッセージを送信
  const content = await main();
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content }],
    model: 'gpt-3.5-turbo',
  });
  // 回答結果を返却
  console.log(completion);
  const answer = completion.choices[0].message?.content;
  if (answer !== null) {
    return answer;
  }
  return 'a';
}

//gpt と会話できる
// curl -X POST https://api.openai.iniad.org/api/v1/chat/completions -H "Content-Type: application/json" -H "Authorization: Bearer 5FJX65hZcwvqexe7vXWRKZrp6dIqz9LqN9QzZhl6cCiXq9PEib7cJwdfSsuXEQBFgokFOei_iHAZeIjx-QvZvkw" -d '{"model": "gpt-3.5-turbo","messages": [{"role": "user", "content": "これはテストです"}]}'
