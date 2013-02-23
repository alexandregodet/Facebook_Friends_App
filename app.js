
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , async = require('async')
  , request = require('request')
  , generate = require('./routes/generate')
  , friends = require('./friends')
  , getFriends = require('./getFriendsv3')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  /*app.set('view engine', 'jade');*/
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req,res){
	fs.readFile("./views/index.htm",function(err,data){
		if(err){
			console.error(err);
			res.send(err);
			return;
		}
		res.set('Content-Type','text/html');
		res.send(data.toString());
	});
});


app.get('/friends',function(req,res){
	res.json(friends);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});








