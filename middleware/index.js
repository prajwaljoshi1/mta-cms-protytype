//middleware

//var Blog = require('../models/blog');


var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();

  }
    req.flash("error", "You need to be logged in to do this");
    res.redirect("/");
};

middlewareObj.isBlogFullAccess = function(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.userType == 'blogfullAccess' || req.user.userType == 'admin'){
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


// get each category objects

middlewareObj.getEachCategoryObjects = function(req,res,next){
    var ProductBrand = require('../models/product/productBrand.js');
    var ProductAuthor = require('../models/product/productAuthor.js');
    //var ProductCategory = require('../models/product/ProductCategory.js');
    var productFiction = require('../models/product/ProductFiction.js');

    var brandList = [];

    ProductBrand.find({}, function(err, allProductBrands) {
        if (err) {
            console.log(err);
        } else {
              req.brandList = allProductBrands;
              ProductAuthor.find({}, function(err, allProductAuthors) {
                  if (err) {
                      console.log(err);
                  } else {
                        req.authorList = allProductAuthors;


                                  productFiction.find({}, function(err, allProductFiction) {
                                      if (err) {
                                          console.log(err);
                                      } else {
                                            req.fictionList = allProductFiction;
                                            productFiction.find({}, function(err, allProductFiction) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                      req.fictionList = allProductFiction;
                                                        return next();



                                          }
                                    });

                            }
                        });

                  }
              });
        }
    });

};


//  return next();


 middlewareObj.getProductDetails = function(req, res, next){

     var Product = require('../models/product/product.js');

   Product.findById(req.params.productId, function(err, foundProduct) {
       if (err) {
           console.log(err);
       } else {
             req.productDetails = foundProduct;
             return next();
       }
   });
  };





module.exports = middlewareObj;
