var createError = require('http-errors');
var express = require('express');

var port = 3000;

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;

var clients = {};
const webapp = 'webapp';
const appVR = 'appVR';
//const empatica = 'empatica';
const nextPhase = 'nextPhase';
const previousPhase = 'previousPhase';
const finalPhase = 'finalPhase';
const bpm = 'bpm';
const whoAreYou = 'whoAreYou';
const transitionComplete = 'transitionComplete';
const tDuration = 'tDuration';
const phaseUpdate = 'phaseUpdate';

io.on('connection' , function(socket){
  who_are_you(socket.id);


  socket.on('add-user', function(data){
    clients[data.username] = {
      "socket" : socket.id
    };

    console.log("client " + data.username + " connected!");


  });

  socket.on('disconnect', function(){
    for(var name in clients){
      if(clients[name].socket === socket.id){
        console.log(name + " disconnected!");
        delete clients[name];
        break;
      }
    }
  });

  socket.on(nextPhase, function(data){
    emit(appVR, nextPhase, data);

  });

  socket.on(previousPhase, function (data) {
      emit(appVR, previousPhase, data)
  });

  socket.on(finalPhase, function (data) {
      emit(appVR, finalPhase, data);
  });

  socket.on(bpm, function (data) {
      emit(webapp, bpm, data)
  });


  socket.on(transitionComplete, function (data) {
      emit(webapp, transitionComplete, data);
  });

  socket.on(tDuration, function(data){
    emit(webapp, tDuration, data);
  });

  socket.on(phaseUpdate, function(data){
    emit(webapp, phaseUpdate, data);
  });

  function who_are_you(destination) {
      io.sockets.connected[destination].emit(whoAreYou, {message : whoAreYou});
  }
  function emit(destination, message, data){
    if(clients[destination]){
        io.sockets.connected[clients[destination].socket].emit(message, data);
    }
    else {
      console.log("Message to " + destination + " failed to reach the destination.");
    }

  }


});


http.listen(port, function () {
    console.log("Listening on *:" + port);
});