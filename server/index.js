const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const jwt = require("jsonwebtoken");
const fs = require("fs");

const APP_ID = process.env.app_id;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/getToken', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  var privateKey = fs.readFileSync('private.key');
  var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256', issuer: APP_ID });

  res.send(JSON.stringify({ token: `${token}` }));

});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
