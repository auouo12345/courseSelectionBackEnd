var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentRegisterRouter = require('./routes/studentRegister');
var studentLoginRouter = require('./routes/studentLogin');
var teacherRegisterRouter = require('./routes/teacherRegister');
var teacherLoginRouter = require('./routes/teacherLogin');
var logoutRouter = require('./routes/logout');
var courseAddRouter = require('./routes/courseAdd');
var courseDropRouter = require('./routes/courseDrop');
var studentTimetableRouter = require('./routes/studentTimetable');
var courseTimetableRouter = require('./routes/courseTimetable');
var teacherTimetableRouter = require('./routes/teacherTimetable');
var searchRouter = require('./routes/search');
var getStudentInfo = require('./routes/getStudentInfo');
var addFocus = require('./routes/addFocus');
var dropFocus = require('./routes/dropFocus')
var getFocusList = require('./routes/getFocusList');
var getTeacherInfo = require('./routes/getTeacherInfo');//by Ian
var getUserRoleRouter = require('./routes/getUserRole');//by Ian
var getTeacherCoursesRouter = require('./routes/getTeacherCourses');
var updateCourseInfoRouter = require('./routes/updateCourseInfo');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true
}));
app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true
}));
//測試
app.use((req, res, next) => {
  console.log(`收到請求: ${req.method} ${req.url}`);
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/studentRegister' , studentRegisterRouter);
app.use('/api/studentLogin' , studentLoginRouter);
app.use('/api/teacherRegister' , teacherRegisterRouter);
app.use('/api/teacherLogin' , teacherLoginRouter);
app.use('/api/logout' , logoutRouter);
app.use('/api/courseAdd' , courseAddRouter);
app.use('/api/courseDrop' , courseDropRouter);
app.use('/api/studentTimetable' , studentTimetableRouter);
app.use('/api/courseTimetable' , courseTimetableRouter);
app.use('/api/teacherTimetable' , teacherTimetableRouter);
app.use('/api/search' , searchRouter);
app.use('/api/getStudentInfo',getStudentInfo);
app.use('/api/addFocus', addFocus);
app.use('/api/dropFocus', dropFocus);
app.use('/api/getFocusList', getFocusList);
app.use('/api/getTeacherInfo', getTeacherInfo);//by Ian
app.use('/api/getUserRole', getUserRoleRouter);//by Ian
app.use('/api/getTeacherCourses' , getTeacherCoursesRouter);
app.use('/api/updateCourseInfo' , updateCourseInfoRouter);
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
