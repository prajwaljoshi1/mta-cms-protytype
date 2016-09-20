var mysql = require('mysql2');
var express = require("express");
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/mtadb");

 var CATEGORY = 'Language'

var Product = require("../models/product/product.js");
var MODEL = require("../models/product/product"+CATEGORY+".js");


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'bitnami_wordpress'
});


connection.connect();


var query = "select   DISTINCT wp_posts.post_name, wp_terms.name, wp_terms.slug from wp_terms INNER JOIN wp_term_taxonomy on wp_terms.term_id = wp_term_taxonomy.term_id INNER JOIN wp_term_relationships wpr on wpr.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id INNER JOIN wp_posts on wp_posts.ID = wpr.object_id where post_type = 'Product' AND wp_term_taxonomy.taxonomy = '"+CATEGORY+"';"  ;


  connection.query(query, function(err, results) {

    if(err) throw err;

    var categoryList = [];


    results.forEach(function(item){

      var itemSlug =  item.slug;
      if(categoryList.indexOf(itemSlug) !== -1){

          updateCategoryAndAddToProduct(item.post_name, item.slug);
      }else{
      categoryList.push(itemSlug);

          //createCategoryAndAddToProduct(item.post_name,item.name, item.slug);


      }

    });

  });



  function updateCategoryAndAddToProduct(itemPostName, itemSlug){

  MODEL.findOne({slug: itemSlug}, function(err, foundCategory) {
    Product.findOne({slug: itemPostName}, function(err, product) {
      if (err) {
                console.log(err);
      } else {

                var updatingCategory = foundCategory;

                updatingCategory.products.push(product._id);


                MODEL.findByIdAndUpdate(foundCategory._id, updatingCategory, function(err, updatedCategory) {
                        if(err){
                                  console.log(err);
                        }else{
                                  var updatingProduct =  product;
                                  updatingProduct.productLanguage.push({                                                                           // change here
                                    id: updatedCategory._id,
                                    brand:updatedCategory.productLanguageName                                                                        // change here
                                  });



                                  Product.findByIdAndUpdate(product._id, updatingProduct, function(err, updatedProduct) {
                                          if(err){
                                                  console.log(err);
                                          }else{
                                                  console.log("update category " + updatedCategory.slug);
                                          }

                                    });


                            }
                    });


                }
       });

     });
  }


  function createCategoryAndAddToProduct(itemPostName,itemName, itemSlug){
    Product.findOne({slug: itemPostName}, function(err, foundProduct) {
      if (err) {
          console.log(err);
      } else {
          var newCategoryItem = {
              slug:itemSlug,
              productLanguageName: itemName,                                                                                                   //change here
              products: []
          }

         newCategoryItem.products.push(foundProduct._id);

            MODEL.create(newCategoryItem, function(err, newlyCreatedCategory) {
                if (err) {

                    console.log(err);
                } else {

                   var updatingProduct = foundProduct;
                   console.log(foundProduct);
                    updatingProduct.productLanguage.push({                                                                                             /// change here
                        id: newlyCreatedCategory._id,
                        brand:newlyCreatedCategory.productLanguageName                                                                                /// change here
                   });


                      Product.findByIdAndUpdate(foundProduct._id, updatingProduct, function(err, updatedProduct) {
                        if(err){
                          console.log(err);
                        }else{
                          console.log("Insert category " +  newlyCreatedCategory.slug);
                        }
                      });
                }
            });


        }


    });
  }
