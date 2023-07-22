const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Methods', '*');
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

function normalizaPort(val) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

const userRoute = require('./src/routes/userRoute');
const filmRoute = require('./src/routes/filmRoute');
const userMovieRoute = require('./src/routes/userMovieRoute');

app.use('/users', userRoute);
app.use('/films', filmRoute);
app.use('/userMovies', userMovieRoute);

const port = normalizaPort(process.env.PORT || '3001');

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
