import express from 'express';
import basicAuth from 'basic-auth-connect';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const username = process.env.BASIC_AUTH_USERNAME;
const password = process.env.BASIC_AUTH_PASSWORD;

app.use(basicAuth(username,password));

app.use((req,res) => {
  res.end('認証しました');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,() =>{
  console.log(`サーバーがポート　${PORT} で起動しました。`)
});

export default app;