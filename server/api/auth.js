import express from 'express';
import basicAuth from 'basic-auth-connect';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const username = process.env.BASIC_AUTH_USERNAME;
const password = process.env.BASIC_AUTH_PASSWORD;

app.use(basicAuth(username,password));

app.use((req,res) => {
  res.and('認証しました');
});

export default app;