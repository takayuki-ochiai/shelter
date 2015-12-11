var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var viewHelper = require('./components/viewHelper');
var viewHelperAdmin = require('./components/viewHelperAdmin');


var app = express();

// ビューヘルパーをセットアップ
app.locals.segment =viewHelper.segment;
// セグメントマスタ設定
app.locals.setting =viewHelperAdmin.setting;

// セッションセットアップ
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
    maxAge: 60 * 60 * 1000
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if(req.session.userId){
    next();
  }else{
    res.redirect('/');
  }
});

app.use('/users', users);
app.use('/admin', admin);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
