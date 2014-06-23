
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('routes');
var http = require('http');
var path = require('path');
var dbStorage = require('connect-mongo')(express);
var mysql = require('lib/mysql');
var app = express();
var conf = require('config');

var user = require('routes/user/user');
var auth = require('routes/user/auth');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'top_DSCSDFW4RCDSghgSVFE5F_secret',
    store: new dbStorage({
        url: conf.get('mongoose:uri'),
        collection : 'session'
    })
}))
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', auth.AuthedUser, routes.index);


app.get('/user', auth.RestrictAccess, user.Index);
app.post('/user/new', auth.SignUp);
app.post('/user/create', auth.CreateUser);
app.get('/user/confirm/:token', auth.ConfirmMail);
app.get('/user/show/:token', auth.ShowToken);

app.post('/login', auth.SignIn);

app.post('/logout', auth.RestrictAccess, auth.SignOutPost);
app.get('/logout', auth.RestrictAccess, auth.SignOutGet);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
