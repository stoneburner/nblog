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


/*
 * Blog related functions
 */

exports.main_blog = function(req,res) {
  var navdata=req.navdata;
  navdata.navkey='home';
  req.db.collection('blogposts').find().sort({id:-1}).limit(10).toArray(function (err, items) {
    if (err) {
      navdata.err=err;
      res.render('error',navdata);
    } else {
      navdata.blogposts=items;
      res.render('blog',navdata);
    }
  });
};

exports.show_category = function(req, res){
  var navdata=req.navdata;
  navdata.navkey=req.params.category;
  req.db.collection('blogposts').find({category:req.params.category}).sort({id:-1}).limit(10).toArray(function (err, items) {
    if (err) {
      navdata.err=err;
      res.render('error',navdata);
    } else {
      navdata.blogposts=items;
      res.render('blog',navdata);
    }
  });
};

exports.showfile = function(req,res) {
  req.db.gridfs().open(req.params.filename,'r',function(err,gs) {
    if (err) {
      res.send(404);
    } else {
      gs.pipe(res);
    }
  });
};

exports.show_blogpost = function(req,res) {

};
