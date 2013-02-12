
/*
 * admin functions
 */

exports.admin_index = function(req,res) {
  var navdata=req.navdata;
  navdata.navkey='home';
  res.render('blog',navdata);
};

exports.new_post = function(req, res){
  var navdata=req.navdata;
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

  console.log(blogpost);

  req.db.collection('blogposts').save(blogpost,{strict:true},function(err){
    if (err) {
      console.log(err);
    }
    res.send({success:true});
  });
};