
/*
 * admin functions
 */

exports.admin_index = function(req, res){
  var navdata=req.navdata;
  navdata.navkey=req.params.category;
  res.render('blog_admin',navdata);
};