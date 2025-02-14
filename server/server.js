//import文-----------------------------------------------------------------------
import dotenv from 'dotenv';
import express, { response } from 'express';
import cors from 'cors';
import OpenAI,{ AzureOpenAI } from 'openai';
import "@azure/openai/types";
//--------------------------------------------------------------------------------
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// access environment variables
const apiKey = process.env.AZURE_OPENAI_API_KEY; 
const endpoint = process.env.AZURE_OPENAI_ENDPOINT; 
const deployment = "gpt-4o"; //デプロイ名
const apiVersion = "2024-08-01-preview";


const app = express();


//テスト用にURLを3つ作った
const allowedOrigins = [
  'https://www.sakubun-otasuke.com',
  'https://azure-react-sakubun-otasuke.vercel.app',
  'https://react-sakubun-otasuke.vercel.app',
]

app.use(cors({
  origin: function (origin,callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else{
      console.error(`CORSのエラーが発生したよ:origin ${origin} not allowed`);
    }
  }
}));
app.use(express.json());


//処理------------------------------------------------------------------------

//表現ぴったり探し用
app.get('/',async (req,res) => {
  res.status(200).send({
    message: 'Hello 表現'
  })
});
app.post('/',async (req,res) =>{

  try{
    const prompt = req.body.prompt;
    //GASの定時実行のための分岐
    if (prompt === 'just say "A"!') {
      // console.log("GASからの定時実行");
      res.status(200).send({
        bot: "GASからの定時実行"
      })
      return;
    }
    
    const user_prompt = `「${prompt}」という言葉をゆたかに表現するため、日本の作文に使われそうな1文の文章を10パターン用意してください。1個目は、どれくらいか程度を表すもの。2個目は、動作を含めた表現にしてください。3個目は、心の中のつぶやきを含めた表現にしてください。4個目は、過去の気持ちで表現してください。5個目は、感情を強調した表現にしてください。6個目は、音や様子を含めて表現してください。7個目は、心の中の叫びのように表現してください。8個目は、何かに影響されて心が変化する様子を含めて下さい。9個目は、無意識で何かをしてしまう様子を含めて下さい。10個目は、自分の表情を含めて表現して下さい。また、一つ一つに改行を入れて下さい。`;
    
    //ここにgradeをとし、作家名に変換する配列を書く
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system","content":`作家のあまんきみこ`,
          "role":"user","content":user_prompt
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
  }catch (error){
    console.log(error);
    res.status(500).send({ error })
  }
})

//表現ぴったり探し以外のとき用-----------------------------------------------

app.post('/danraku',async (req,res) =>{
  try{
    const grade = req.body.gakunen;
    const grades = {
      s1: ["7歳","松谷みよ子"],
      s2: ["8歳","あんびるやすこ"],
      s3: ["9歳","安西水丸"],
      s4: ["10歳","角野栄子"],
      s5: ["11歳","宮沢賢治"],
      s6: ["12歳","ヨシタケシンスケ"],
      t1: ["13歳","新見南吉"],
      t2: ["14歳","重松清"],
      t3: ["15歳","森絵都"],
      k1: ["16歳","住野よる"],
      k2: ["17歳","小川洋子"],
      k3: ["18歳","梨木香歩"],
      oldPeople: ["大人","あさのあつこ"],
    }

    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          "role": "system",
          "content":`作家の${grades[grade][1]}`,

          "role":"user",
          "content": `${grades[grade][0]}向けにしてください。${prompt}指示に従わない場合は再度指示を確認します。最後に「分かりました」や「了解しました」といったコメントを一切加えないでください。`
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
  }catch (error){
    console.log(error);
    res.status(500).send({ error })
  }
})
app.get('/danraku',async (req,res) => {
  res.status(200).send({
    message: 'Hello その他'
  })
});


app.get('/api/azure',async (req,res) => {
  res.status(200).send({
    message: 'test'
  })
});

app.post('/api/azure',async (req,res) => {
  try{
  // console.log(endpoint);
  // console.log('サーバーサイドに入ったよ');
  const client = new AzureOpenAI({
    deployment,apiVersion,apiKey,endpoint
  });

  const prompt = req.body.prompt;
  // console.log(prompt);

  const grade = req.body.gakunen;
  // console.log(grade);
  const grades = {
    s1: ["7歳","松谷みよ子"],
    s2: ["8歳","あんびるやすこ"],
    s3: ["9歳","安西水丸"],
    s4: ["10歳","角野栄子"],
    s5: ["11歳","宮沢賢治"],
    s6: ["12歳","ヨシタケシンスケ"],
    t1: ["13歳","新見南吉"],
    t2: ["14歳","重松清"],
    t3: ["15歳","森絵都"],
    k1: ["16歳","住野よる"],
    k2: ["17歳","小川洋子"],
    k3: ["18歳","梨木香歩"],
    oldPeople: ["大人","あさのあつこ"],
  }
    // console.log(grades[grade][1]);

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: `作家の${grades[grade][1]}` },
      { role: "user", content: `${grades[grade][0]}向けにしてください。${prompt}指示に従わない場合は再度指示を確認します。最後に「分かりました」や「了解しました」といったコメントを一切加えないでください。` }
    ],
  });

  // console.log("Azure-apiの中に入ったよ")

  res.status(200).send({
    bot: response.choices[0].message.content
  })
}catch{
  res.status(500).send({ error })
}
})

app.get('/api/azurehyougen',async (req,res) => {
  res.status(200).send({
    message: 'Hello 表現'
  })
});
app.post('/api/azurehyougen',async (req,res) =>{

  try{
    // console.log(endpoint);
    // console.log('サーバーサイドに入ったよ');
    const client = new AzureOpenAI({
      deployment,apiVersion,apiKey,endpoint
    });
  
    const prompt = req.body.prompt;
    // console.log(prompt);
  
  
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: '作家のあまんきみこ' },
        { role: "user", content: `「${prompt}」という言葉をゆたかに表現するため、日本の作文に使われそうな1文の文章を10パターン用意してください。1個目は、どれくらいか程度を表すもの。2個目は、動作を含めた表現にしてください。3個目は、心の中のつぶやきを含めた表現にしてください。4個目は、過去の気持ちで表現してください。5個目は、感情を強調した表現にしてください。6個目は、音や様子を含めて表現してください。7個目は、心の中の叫びのように表現してください。8個目は、何かに影響されて心が変化する様子を含めて下さい。9個目は、無意識で何かをしてしまう様子を含めて下さい。10個目は、自分の表情を含めて表現して下さい。また、一つ一つに改行を入れて下さい。` }
      ],
    });
  
    // console.log("Azure-apiの中に入ったよ")
  
    res.status(200).send({
      bot: response.choices[0].message.content
    })
  }catch (error){
    res.status(500).send({ error })
  }
  })
  
  app.get('/api/azurehyougen',async (req,res) => {
    res.status(200).send({
      message: 'Hello 表現'
    })
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log('サーバーは動いています！ポート：http://localhost:5000'));
