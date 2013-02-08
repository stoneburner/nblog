
/*
 * GET home page.
 */

exports.index = function(req, res){
  var navdata=req.navdata;
  navdata.navkey='home';
  res.render('index',navdata);
};