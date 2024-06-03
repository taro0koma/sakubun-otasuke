import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import basicAuth from 'express-basic-auth';

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

// app.use(basicAuth({
//   users: { [process.env.BASIC_AUTH_USERNAME]:process.env.BASIC_AUTH_PASSWORD },
//   unauthorizedResponse: getunauthorizedResponse
// }));
const users = {};
users[process.env.BASIC_AUTH_USERNAME] = process.env.BASIC_AUTH_PASSWORD;
app.use(basicAuth({ users, challenge: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// function getunauthorizedResponse(req) {
//   return req.auth
//     ? ('ユーザーID ' + req.auth.user + ':' + req.auth.password + ' は違います')
//     : '入力してください';
// }
app.get('/', async (req, res) => {
  res.status(200).send({
    message: '認証に成功しました'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": `「${prompt}」という言葉をゆたかに表現するため、日本の作文に使われそうな1文の文章を10パターン用意してください。1個目は、どれくらいか程度を表すもの。2個目は、動作を含めた表現にしてください。3個目は、心の中のつぶやきを含めた表現にしてください。4個目は、過去の気持ちで表現してください。5個目は、感情を強調した表現にしてください。6個目は、音や様子を含めて表現してください。7個目は、心の中の叫びのように表現してください。8個目は、何かに影響されて心が変化する様子を含めて下さい。9個目は、無意識で何かをしてしまう様子を含めて下さい。10個目は、自分の表情を含めて表現して下さい。また、一つ一つに改行を入れて下さい。`
        }
      ],
      temperature: 0.2,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0
    });

    res.status(200).send({
      bot: response.choices[0].message.content
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error })
  }
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized');
  } else {
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to process request' });
  }
});
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Failed to process request' });
//     if (!prompt) {
//       return res.status(400).json({ error: 'Input is required' });
//     }
// })

app.listen(5000, () => console.log('サーバーは動いています！ポート：http://localhost:5000'));




// app.get('/', async (req, res) => {
//   res.status(200).send({
//     message: '認証に成功しました'
//   })
// });

// app.post('/', async (req, res) => {

//   try {
//     const prompt = req.body.prompt;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           "role": "user",
//           "content": `「${prompt}」という言葉をゆたかに表現するため、日本の作文に使われそうな1文の文章を10パターン用意してください。1個目は、どれくらいか程度を表すもの。2個目は、動作を含めた表現にしてください。3個目は、心の中のつぶやきを含めた表現にしてください。4個目は、過去の気持ちで表現してください。5個目は、感情を強調した表現にしてください。6個目は、音や様子を含めて表現してください。7個目は、心の中の叫びのように表現してください。8個目は、何かに影響されて心が変化する様子を含めて下さい。9個目は、無意識で何かをしてしまう様子を含めて下さい。10個目は、自分の表情を含めて表現して下さい。また、一つ一つに改行を入れて下さい。`
//         }
//       ],
//       temperature: 0.2,
//       max_tokens: 3000,
//       top_p: 1,
//       frequency_penalty: 0.5,
//       presence_penalty: 0
//     });

//     res.status(200).send({
//       bot: response.choices[0].message.content
//     })
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error })
//   }
// })
