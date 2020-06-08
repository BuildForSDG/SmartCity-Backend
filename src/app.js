const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const dotenv = require('dotenv');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/categories');
const artisanRouter = require('./routes/artisans');
const db = require('./config/connection');
const mail = require('./mail/mail');

const app = express();
dotenv.config();
db.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.set('trust proxy', 1);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mail('scletus40@yahoo.com', 'Cletus', 'welcome');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/artisans', artisanRouter);
app.use('/categories/list', categoryRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, 'Oops! Seems you enterd a wrong url.'));
});

// error handler; next is necessary here
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
