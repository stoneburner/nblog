
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