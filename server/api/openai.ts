import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  dangerouslyAllowBrowser: true, // ***注意*** クライアントサイドの実行を許可
});
export async function ask(message: string): Promise<string> {
  // メッセージを送信
  const content = message;
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
