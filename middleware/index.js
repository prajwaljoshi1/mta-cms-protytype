//middleware

var Blog = require('../models/blog');


var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();

  }
    req.flash("error", "You need to be logged in to do this");
    res.redirect("/");
};


module.exports = middlewareObj;
