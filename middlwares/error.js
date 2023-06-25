// class NotFoundError extends Error {
//   constructor(statusCode, message) {
//     super(message);
//     this.name = "NotFoundError";
//     this.statusCode = 404;
//    }
// };

// class ValidationError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = "ValidationError";
//     this.statusCode = 400;
//   }
// };

// const errorHandler = (err, req, res, next) => {
//     const statusCode = 500;

//     const message = statusCode === 500 ? 'Произошла ошибка на сервере' : err.massage;
//     res.status(statusCode).send({ message });
//     next();
// };

// module.exports = errorHandler;