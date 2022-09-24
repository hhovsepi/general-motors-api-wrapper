import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';


import router from './routes/router.js';

const app = express();

app.use(helmet());
// Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
app.use(logger('dev'));
// HTTP request logger middleware for node.js
app.use(json());
// Parses incoming requests with JSON payloads
app.use(urlencoded({ extended: false }));
// Parses incoming requests with urlencoded payloads
app.use(cookieParser()); 
// Parses incoming requests with cookie payloads

app.use('/', router); // Use the router for all requests

// export the app
export default app;
