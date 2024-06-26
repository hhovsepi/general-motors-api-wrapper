![example workflow](https://github.com/rzgry/Express-REST-API-Template/actions/workflows/node.js.yml/badge.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Smartcar | GM API Wrapper

Simple Smartcar API wrapper for the GM API.

If you use VSC, I would recommend installing the [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) extension

## Getting Started

### Clone the repository

```
git clone https://github.com/hhovsepi/smartcar-gm-wrapper.git
cd smartcar-gm-wrapper
```


### Install dependencies

```
npm install
```

### Running in development

```
npm run dev
```

### Running in production

```
npm start
```

Runs on localhost:3000 by default but can be configured using the `PORT` environment variable or manually in ```src/bin/www.js```


### View documentation

Once you've started the server, navigate to /docs to view the full documentation. You can call the API directly from the documentation.

```
http://localhost:3000/docs
```
![Screen Shot 2022-09-26 at 9 00 44 AM](https://user-images.githubusercontent.com/81712518/192325223-7e0181a9-4d21-4e2e-856f-c34c63ceb81a.png)

### Running tests

```
npm test
```

### Linting
```
npm run lint

# fix issues
npm run lint:fix
```

# Technologies Used

######
| Technology | Description |
| --------------- | --------- |
| [Node.js](https://handlebarsjs.com/) | JS run-time environment that executes JS code outside of a browser |
| [Express.js](https://expressjs.com/) | Node.js web application server framework |
| [eslint](https://eslint.org/) | Linter utility for identifying and reporting on patterns in JS |
| [Jest](https://jestjs.io/) | JS testing framework |
| [Supertest](https://www.npmjs.com/package/supertest) | HTTP assertion library |
| [Swagger](https://swagger.io/) | API documentation tool |
| [Axios](https://www.npmjs.com/package/axios) | Promise based HTTP client for the browser and node.js |
| [Prettier](https://prettier.io/) | Opinionated code formatter |
| [Babel](https://babeljs.io/) | JS compiler |
| [Nodemon](https://nodemon.io/) | Utility that will monitor for any changes in your source and automatically restart your server |
| [dotenv](https://www.npmjs.com/package/dotenv) | Loads environment variables from a .env file into process.env |
| [morgan](https://www.npmjs.com/package/morgan) | HTTP request logger middleware for node.js |
