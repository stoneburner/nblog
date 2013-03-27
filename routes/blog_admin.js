
/*
 * admin functions
 */

var fs=require('fs');
var bcrypt=require('bcrypt');

var admin_nav=[
  {key:'list',name:'List Posts',link:'/admin/list_posts'},
  {key:'upload',name:'Upload Files',link:'/admin/upload'},
  {key:'create',name:'Create Blogpost',link:'/admin/create_post'},
];

exports.admin_index = function(req,res) {
  var navdata=req.navdata;
  navdata.admin_nav=admin_nav;
  navdata.navkey='home';
  if (req.session.logged === true) {
    res.render('blog_admin',navdata);
  } else {
    res.render('login',navdata);
  }
};

exports.show_login = function(req,res) {
  var navdata=req.navdata;
  navdata.navkey='login';
  res.render('login',navdata);
};

exports.admin_dologin=function(req,res) {
  var username=req.body.username;
  var password=req.body.password;
  var rememberme=req.body.rememberme;
  console.log(username,password,rememberme);

  if (!username && !password) {
    res.json({success:false,logged:false});
  }

  req.db.collection('users').findOne({email:username},function(err,item) {
    if (!err && item && item.pwhash) {
      bcrypt.compare(password,item.pwhash,function(err,result) {
        if (!err && result===true) {
          req.session.logged=true;
          req.session.user=item;
          if (item.admin && item.admin===true) {
            req.session.admin=true;
          }
          res.json({success:true,logged:true});
        } else {
          res.json({success:false,logged:false});
        }
      });
    } else {
      res.json({success:false,logged:false});
    }
  });
//  var salt=bcrypt.genSaltSync(10);
//  var hash=bcrypt.hashSync(password,salt);
//  console.log(username,password,rememberme,hash);
};

exports.admin_logout=function(req,res) {
  if (req.session) {
    req.session.destroy();
  }
  res.json({success:true});
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
      res.render('blog_admin',navdata);
    }
  });
};

exports.admin_list_images = function(req,res) {
  var navdata=req.navdata;
  req.db.collection('fs.files').find({filename:/\.(jpg|png|gif)/i},{filename:1,length:1,uploadDate:1}).sort({filename:-1}).toArray(function (err, items) {
    if (err) {
      navdata.err=err;
      res.json({success:false,error:err});
    } else {
      console.log(items);
      res.render('imagelist',{images:items});
    }
  });
};


exports.new_post = function(req, res){
  var navdata=req.navdata;
  navdata.admin_nav=admin_nav;
  navdata.navkey='admin';
  navdata.blogposts=[];
  console.log(navdata);
  res.render('editor',navdata);
};

exports.edit_post = function(req, res){
  var navdata=req.navdata;
  var oid=req.db.ObjectID.createFromHexString(req.params.id)
  req.db.collection('blogposts').findOne({_id:oid},function (err, blogpost) {
    if (err) {
      navdata.err=err;
      res.render('error',navdata);
    } else {
      navdata.blogpost=blogpost;
      navdata.admin_nav=admin_nav;
      navdata.navkey='admin';
      navdata.blogposts=[];
      res.render('editor',navdata);
    }
  });
};

exports.delete_post = function(req, res){
  var navdata=req.navdata;
  var oid=req.db.ObjectID.createFromHexString(req.params.id)
  req.db.collection('blogposts').remove({_id:oid},function (err, removed) {
    if (err) {
      navdata.err=err;
      res.json({success:false,err:err});
    } else {
      res.json({success:true,deleted:removed});
    }
  });
};

exports.save_post = function(req,res) {
  var blogpost=req.body;

  if (!blogpost.id) {
    blogpost.user="admin";
    blogpost.publish_time=new Date();
    blogpost.tags=blogpost.tags.split(",");
    req.db.collection('blogposts').save(blogpost,{strict:true},function(err){
      if (err) {
        console.log(err);
        res.json({success:false,err:err});
      } else {
        res.send({success:true});
      }
    });
  } else {
    var oid=req.db.ObjectID.createFromHexString(blogpost.id);
    req.db.collection('blogposts').findOne({_id:oid},function (err, oldpost) {
      if (err) {
        navdata.err=err;
        res.json({success:false,err:err});
      } else {
        oldpost.title=blogpost.title;
        oldpost.html=blogpost.html;
        oldpost.tags=blogpost.tags;
        oldpost.category=blogpost.category;
        oldpost.edit_time=new Date();
        console.log(oldpost);
        req.db.collection('blogposts').save(oldpost,{strict:true},function(err){
          if (err) {
            console.log(err);
            res.json({success:false,err:err});
          }
          res.send({success:true});
        });

      }
    });
  }
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