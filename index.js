import express from 'express';

import * as dotenv from 'dotenv';
dotenv.config();

import debug from 'debug';
const debugIndex = debug('app:Index');

import { dogOwnerRouter } from './routes/api/dogOwner.js';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies to req.body
app.use(express.json()); // Parse JSON bodies to req.body
app.use(express.static('frontend/dist'));

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.listen(port, () => {
  debugIndex(`Example app listening on port http://localhost:${port}`);
});

app.use('/api/pet-owners', dogOwnerRouter);