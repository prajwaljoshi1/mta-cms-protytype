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

middlewareObj.isBlogFullAccess = function(req, res, next){
  console.log("test middleware");
  if(req.isAuthenticated()){
    if(req.user.userType == 'blogfullAccess' || req.user.userType == 'admin'){
        console.log("test middleware2");
      return next();
    }
  }
    req.flash("error", "You dont have permission in to do this");
    res.redirect("/home")
};

middlewareObj.isBlogReadOnly = function(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.userType == 'blogfullAccess' || req.user.userType == 'admin' || req.user.userType == 'blogReadOnly'){
      return next();
    }
  }
    req.flash("error", "You dont have permission in to do this");
    res.redirect("/home");
};

middlewareObj.isProductReadOnly = function(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.userType == 'productFullAccess' || req.user.userType == 'admin' || req.user.userType == 'productReadOnly'){
      return next();
    }
  }
    req.flash("error", "You dont have permission in to do this");
    res.redirect("/home")
};

middlewareObj.isProductFullAccess = function(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.userType == 'productFullAccess' || req.user.userType == 'admin'){
      return next();
    }
  }
    req.flash("error", "You dont have permission in to do this");
    res.redirect("/home")
};

middlewareObj.isAdmin = function(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.userType == 'admin'){
      return next();
    }
  }
    req.flash("error", "You do not have permission in to do this!");
    res.redirect("/home")
};




module.exports = middlewareObj;
