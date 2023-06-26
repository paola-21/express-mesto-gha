const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.json());
app.use(router);
app.use(helmet());
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

// app.use((err, req, res, next) => {
//   res.status(500).send({ message: 'На сервере произошла ошибка' });
// });

// app.use((err, req, res, next) => {
//   res.status(err.statusCode).send({ message: err.message });
// });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
