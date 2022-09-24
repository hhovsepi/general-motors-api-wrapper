/* eslint-disable import/extensions */

// TODO: 
/*

1. Finish error handling
2. Finish tests
3. Finish documentation
4. Refactor code
5. Add comments


*/



import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';


import router from './routes/router.js';

const app = express();

app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(logger('dev')); // will log requests to the console
app.use(json()); // parses incoming requests with JSON payloads
app.use(urlencoded({ extended: false })); // parses incoming requests with urlencoded payloads
app.use(cookieParser()); // parses incoming requests with cookie payloads

app.use('/', router);  // use the router for all requests


// pass any unhandled errors to the error handler



// catch 404 and forward to error handler


// export the app
export default app;
