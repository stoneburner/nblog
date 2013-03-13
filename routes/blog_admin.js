
/*
 * admin functions
 */

var fs=require('fs');

var admin_nav=[
  {key:'list',name:'List Posts',link:'/admin/list_posts'},
  {key:'upload',name:'Upload Files',link:'/admin/upload'},
  {key:'create',name:'Create Blogpost',link:'/admin/create_post'},
];

exports.admin_index = function(req,res) {
  var navdata=req.navdata;
  navdata.admin_nav=admin_nav;
  navdata.navkey='home';
  res.render('blog_admin',navdata);
};

exports.admin_list_posts = function(req,res) {
  var navdata=req.navdata;
  navdata.navkey='home';
  navdata.admin_nav=admin_nav;
  req.db.collection('blogposts').find().sort({id:-1}).limit(10).toArray(function (err, items) {
    if (err) {
      navdata.err=err;
      res.render('error',navdata);
    } else {
      navdata.blogposts=items;
      console.log(navdata);
      res.render('blog_admin',navdata);
    }
  });
};

exports.admin_list_files = function(req,res) {
  var navdata=req.navdata;
  navdata.navkey='home';
  navdata.admin_nav=admin_nav;
  req.db.collection('blogposts').find().sort({id:-1}).limit(10).toArray(function (err, items) {
    if (err) {
      navdata.err=err;
      res.render('error',navdata);
    } else {
      navdata.blogposts=items;
      console.log(navdata);
      res.render('blog_admin',navdata);
    }
  });
};

exports.new_post = function(req, res){
  var navdata=req.navdata;
  navdata.admin_nav=admin_nav;
  navdata.navkey='admin';
  navdata.blogposts=[];
  console.log(navdata);
  res.render('blog_admin',navdata);
};

exports.save_post = function(req,res) {
  var blogpost=req.body;

  if (!blogpost.id) {
    blogpost.user="admin";
    blogpost.publish_time=new Date();
    blogpost.tags=blogpost.tags.split(",");
  }

  req.db.collection('blogposts').save(blogpost,{strict:true},function(err){
    if (err) {
      console.log(err);
    }
    res.send({success:true});
  });
};


exports.upload = function(req, res){
  var navdata=req.navdata;
  navdata.admin_nav=admin_nav;
  navdata.navkey='admin';
  navdata.blogposts=[];
  console.log(navdata);
  res.render('upload',navdata);
};

exports.doupload = function(req,res) {
  console.log(req.files);
  console.log(req.files.file.path);

  req.db.gridfs().open(req.files.file.name,'w',function(err,gs) {
    var readStream = fs.createReadStream(req.files.file.path);
    readStream.on('open', function () {
      readStream.pipe(gs);
      res.send("ok");
    });
  });
};