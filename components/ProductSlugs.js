var async = require('async');
var Product = require('../models/product/product.js');
var ProductCategory = require("../models/product/productCategory.js");
var ProductBrand = require('../models/product/productBrand.js');
var productAuthor = require('../models/product/productAuthor.js');
var ProductFiction = require('../models/product/productFiction.js');
var ProductGenre = require('../models/product/productGenre.js');
var ProductGrades = require('../models/product/productGrades.js');
var ProductLanguage = require('../models/product/productLanguage.js');
var ProductLexile = require('../models/product/productLexile.js');
var ProductReadingLevel = require('../models/product/ProductReadingLevel.js');
var ProductSeries = require('../models/product/productSeries.js');
var ProductStrategy = require('../models/product/productStrategy.js');
var ProductTheme = require('../models/product/productTheme.js');
var ProductYearLevel = require('../models/product/productYearLevel.js');


var getAllProductsSlugs = function(params, cb){
  async.waterfall([
    function( callback){
      console.log("product");

      var query = Product.find({}).select('slug');
        query.exec(function(err, allProductSlug) {
          if (err) {
             callback(err, null)
          } else {
           var slugList =[];

           allProductSlug.forEach(function(product){
               slugList.push(product.slug)
            });
            callback( null, slugList);
          }
          });
    },
      function( slugList, callback){
        console.log("Category");
        console.log(slugList.length);
        var query = ProductCategory.find({}).select('slug');
        query.exec(function(err, allProductCategorySlugs) {
          if (err) {
             callback(err,null)
          } else {

           allProductCategorySlugs.forEach(function(category){
               slugList.push(category.slug);
            });
            callback( null, slugList);
          }
          });

      },
        function( slugList, callback){
          console.log("Brand");
          console.log(slugList.length);
          var query = ProductBrand.find({}).select('slug');
          query.exec(function(err, allProductCategorySlugs) {
            if (err) {
               callback(err,null)
            } else {

             allProductCategorySlugs.forEach(function(category){
                 slugList.push(category.slug);
              });
              callback( null, slugList);
            }
            });
          },
            function( slugList, callback){
              console.log("Fiction");
              console.log(slugList.length);
              var query = ProductFiction.find({}).select('slug');
              query.exec(function(err, allProductCategorySlugs) {
                if (err) {
                   callback(err,null)
                } else {

                 allProductCategorySlugs.forEach(function(category){
                     slugList.push(category.slug);
                  });
                  callback( null, slugList);
                }
                });

            },
              function( slugList, callback){
                console.log("Genre");
                console.log(slugList.length);
                var query = ProductGenre.find({}).select('slug');
                query.exec(function(err, allProductCategorySlugs) {
                  if (err) {
                     callback(err,null)
                  } else {

                   allProductCategorySlugs.forEach(function(category){
                       slugList.push(category.slug);
                    });
                    callback( null, slugList);
                  }
                  });

              },
                function( slugList, callback){
                  console.log("Grades");
                  console.log(slugList.length);
                  var query = ProductGrades.find({}).select('slug');
                  query.exec(function(err, allProductCategorySlugs) {
                    if (err) {
                       callback(err,null)
                    } else {

                     allProductCategorySlugs.forEach(function(category){
                         slugList.push(category.slug);
                      });
                      callback( null, slugList);
                    }
                    });

                },
                  function( slugList, callback){
                    console.log("Language");
                    console.log(slugList.length);
                    var query = ProductLanguage.find({}).select('slug');
                    query.exec(function(err, allProductCategorySlugs) {
                      if (err) {
                         callback(err,null)
                      } else {

                       allProductCategorySlugs.forEach(function(category){
                           slugList.push(category.slug);
                        });
                        callback( null, slugList);
                      }
                      });

                  },
                    function( slugList, callback){
                      console.log("Lexile");
                      console.log(slugList.length);
                      var query = ProductLexile.find({}).select('slug');
                      query.exec(function(err, allProductCategorySlugs) {
                        if (err) {
                           callback(err,null)
                        } else {

                         allProductCategorySlugs.forEach(function(category){
                             slugList.push(category.slug);
                          });
                          callback( null, slugList);
                        }
                        });

                    },
                      function( slugList, callback){
                        console.log("ReadingLevel");
                        console.log(slugList.length);
                        var query = ProductReadingLevel.find({}).select('slug');
                        query.exec(function(err, allProductCategorySlugs) {
                          if (err) {
                             callback(err,null)
                          } else {

                           allProductCategorySlugs.forEach(function(category){
                               slugList.push(category.slug);
                            });
                            callback( null, slugList);
                          }
                          });

                      },
                        function( slugList, callback){
                          console.log("Series");
                          console.log(slugList.length);
                          var query = ProductSeries.find({}).select('slug');
                          query.exec(function(err, allProductCategorySlugs) {
                            if (err) {
                               callback(err,null)
                            } else {

                             allProductCategorySlugs.forEach(function(category){
                                 slugList.push(category.slug);
                              });
                              callback( null, slugList);
                            }
                            });

                        },
                          function( slugList, callback){
                            console.log("Strategy");
                            console.log(slugList.length);
                            var query = ProductStrategy.find({}).select('slug');
                            query.exec(function(err, allProductCategorySlugs) {
                              if (err) {
                                 callback(err,null)
                              } else {

                               allProductCategorySlugs.forEach(function(category){
                                   slugList.push(category.slug);
                                });
                                callback( null, slugList);
                              }
                              });

                          },
                            function( slugList, callback){
                              console.log("Theme");
                              console.log(slugList.length);
                              var query = ProductTheme.find({}).select('slug');
                              query.exec(function(err, allProductCategorySlugs) {
                                if (err) {
                                   callback(err,null)
                                } else {

                                 allProductCategorySlugs.forEach(function(category){
                                     slugList.push(category.slug);
                                  });
                                  callback( null, slugList);
                                }
                                });

                            },
                              function( slugList, callback){
                                console.log("Year Level");
                                console.log(slugList.length);
                                var query = ProductYearLevel.find({}).select('slug');
                                query.exec(function(err, allProductCategorySlugs) {
                                  if (err) {
                                     callback(err,null)
                                  } else {

                                   allProductCategorySlugs.forEach(function(category){
                                       slugList.push(category.slug);
                                    });
                                    callback( null, slugList);
                                  }
                                  });

                              },     // function( slugList, callback){                       //author
                                      // console.log("Year Level");
                                      // console.log(slugList.length);
                                      // var query = ProductAuthor.find({}).select('slug');
                                      // query.exec(function(err, allProductCategorySlugs) {
                                      //   if (err) {
                                      //      callback(err,null)
                                      //   } else {
                                      //
                                      //    allProductCategorySlugs.forEach(function(category){
                                      //        slugList.push(category.slug);
                                      //     });
                                      //     callback( null, slugList);
                                      //   }
                                      //   });
                                      // }
  ], cb);
};


module.exports = getAllProductsSlugs;
