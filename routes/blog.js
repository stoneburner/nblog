
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
      console.log(navdata);
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
      console.log(navdata);
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