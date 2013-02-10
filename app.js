
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , blog = require('./routes/blog')
  , blog_admin = require('./routes/blog_admin')
  , http = require('http')
  , path = require('path')
  , _ = require('underscore')
  ,mongo = require('mongoskin')
  ;

var app = express();
var db = mongo.db('localhost:27017/nblog?auto_reconnect');

var navdata = {};

  navdata.title="Stoneburners Blog",
  navdata.subtitle="...interesting stuff (probably)",

  navdata.navItems= [
    {key:'home',name:'All Posts',link:'/'},
    {key:'electronics',name:'Electronics',link:'/blog/cat/electronics'},
    {key:'reprap',name:'3d Printer',link:'/blog/cat/reprap'},
    {key:'misc',name:'Various',link:'/blog/cat/misc'},
  ];

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', [setNavData], blog.main_blog);
app.get('/blog/cat/:category', [setNavData] ,blog.show_category);
app.get('/blog', [setNavData] ,blog.main_blog);
app.get('/admin/create_post',[setNavData], blog_admin.new_post);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function makeNavData() {

}

function setNavData(req,res,next) {
  req.db=db;
  req.mongo=mongo;
  req.navdata= _.clone(navdata);
  next();
}

function restrictToAdmin(req,res,next) {
  next();
}