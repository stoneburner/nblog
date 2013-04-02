/*
 Copyright 2013 Alexander Kasimir

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

*/
/**
 * Module dependencies.
 */
var settings=require('./settings');
var express = require('express');
var  blog = require('./routes/blog');
var  blog_admin = require('./routes/blog_admin');
var  http = require('http');
var  path = require('path');
var  _ = require('underscore');
var  mongo = require('mongoskin');
var moment = require('moment');
var MongoStore = require('connect-mongo')(express);
var app = express();

console.log(settings);

var db = mongo.db(settings.db.url);

var navdata = {
   title:"Stoneburners Blog",
   subtitle:"...interesting stuff (probably)",
   navItems: [
    {key:'home',name:'All Posts',link:'/'},
    {key:'electronics',name:'Electronics',link:'/blog/cat/electronics'},
    {key:'reprap',name:'3d Printer',link:'/blog/cat/reprap'},
    {key:'misc',name:'Various',link:'/blog/cat/misc'}
  ],
  categories:['electronics','reprap','misc']
};


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({
    secret: settings.session_secret,
    store: new MongoStore({
      db: 'nblog',
      url:settings.db.url
    })
  }));

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
app.get('/files/:filename',[setNavData],blog.showfile);
app.get('/image/:filename',[setNavData],blog.showfile);
app.get('/admin',[setNavData,restrictToAdmin],blog_admin.admin_index);
app.get('/admin/list_posts',[setNavData,restrictToAdmin],blog_admin.admin_list_posts);
app.get('/admin/create_post',[setNavData,restrictToAdmin], blog_admin.new_post);
app.get('/admin/edit_post/:id',[setNavData,restrictToAdmin], blog_admin.edit_post);
app.post('/admin/save_post',[setNavData,restrictToAdmin],blog_admin.save_post);
app.get('/admin/delete_post/:id',[setNavData,restrictToAdmin],blog_admin.delete_post);
app.get('/admin/upload',[setNavData,restrictToAdmin],blog_admin.upload);
app.post('/admin/doupload',[setNavData,restrictToAdmin],blog_admin.doupload);
app.post('/admin/login',[setNavData],blog_admin.admin_dologin);
app.post('/admin/logout',[setNavData],blog_admin.admin_logout);
app.get('/admin/imagelist',[setNavData],blog_admin.admin_list_images);
app.get('/login',[setNavData],blog_admin.show_login);

app.get('/admin/editortest',[setNavData],function(req,res) {
  res.render('editor',req.navdata);
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function makeNavData() {

}

function setNavData(req,res,next) {
  req.db=db;
  req.mongo=mongo;
  req.navdata= _.clone(navdata);
  req.navdata.navkey='none';
  req.navdata.moment=moment;
  req.navdata.user=req.session.user;
  req.navdata.admin=req.session.admin;
  next();
}

function restrictToAdmin(req,res,next) {
  if (req.session.admin===true) {
    next();
  } else {
    res.redirect('/');
  }
}