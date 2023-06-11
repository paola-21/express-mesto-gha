const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6485f525a43de59ea5d1aeb7',
  };

  next();
});

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});