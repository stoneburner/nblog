
/*
 * GET users listing.
 */

exports.show_category = function(req, res){
  var navdata=req.navdata;
  navdata.navkey=req.params.category;
  res.render('blog',navdata);
};