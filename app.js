const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const helmet = require('helmet');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6488cc76bc78858bf0dbf787',
  };

  next();
});

app.use(express.json());
app.use(router);
app.use(helmet());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
