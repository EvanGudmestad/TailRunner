import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import debug from 'debug';
const debugIndex = debug('app:Index');

import { authMiddleware } from '@merlin4/express-auth';

import { dogOwnerRouter } from './routes/api/dogOwner.js';
import { orderRouter } from './routes/api/order.js';
import { userRouter } from './routes/api/user.js';
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies to req.body
app.use(express.json()); // Parse JSON bodies to req.body
app.use(express.static('frontend/dist')); // Serve the React.js frontend

app.use(cors());

app.use(cookieParser());

app.use(authMiddleware(process.env.JWT_SECRET, 'authToken',{
  httpOnly:true,
  maxAge: 1000 * 60 * 60
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Catch-all route to serve index.html in the /frontend/dist folder for React Router
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.listen(port, () => {
  debugIndex(`Example app listening on port http://localhost:${port}`);
});

app.use('/api/pet-owners', dogOwnerRouter);
app.use('/api/orders', orderRouter);
app.use('/api/users', userRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

//handle server exceptions to keep my server from crashing
app.use((err, req, res, next) => {
  res.status(err.status).json({error: err.message});
});