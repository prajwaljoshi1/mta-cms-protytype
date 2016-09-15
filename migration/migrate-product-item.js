var mysql = require('mysql2');
var express = require("express");
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/mtadb");
var Product = require("../models/product/product.js");
var Brand = require("../models/product/productBrand.js");


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'bitnami_wordpress'
});


connection.connect();


var query = "select   DISTINCT wp_posts.post_name, wp_terms.name, wp_terms.slug from wp_terms INNER JOIN wp_term_taxonomy on wp_terms.term_id = wp_term_taxonomy.term_id INNER JOIN wp_term_relationships wpr on wpr.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id INNER JOIN wp_posts on wp_posts.ID = wpr.object_id where post_type = 'Product' AND wp_term_taxonomy.taxonomy = 'item';"  ;


  connection.query(query, function(err, results) {

    if(err) throw err;

    var brandList = [];


    results.forEach(function(item){

      var itemSlug =  item.slug;

      if(brandList.indexOf(itemSlug) !== -1){

          updatedBrandAndAddTOProduct(item.post_name, item.slug);
      }else{
        brandlist = brandList.push(itemSlug);

          //createBrandAndAddToProduct(item.post_name,item.name, item.slug);


      }

    console.log(  brandList.length );
    });

  });



  function updatedBrandAndAddTOProduct(itemPostName, itemSlug){

  Brand.findOne({slug: itemSlug}, function(err, foundBrand) {
    Product.findOne({slug: itemPostName}, function(err, product) {
      if (err) {
                console.log(err);
      } else {

                var updatingBrand = foundBrand;

                updatingBrand.products.push(product._id);


                Brand.findByIdAndUpdate(foundBrand._id, updatingBrand, function(err, updatedBrand) {
                        if(err){
                                  console.log(err);
                        }else{
                                  var updatingProduct =  product;
                                  updatingProduct.productBrand.push({
                                    id: updatedBrand._id,
                                    brand:updatedBrand.productBrandName
                                  });



                                  Product.findByIdAndUpdate(product._id, updatingProduct, function(err, updatedProduct) {
                                          if(err){
                                                  console.log(err);
                                          }else{
                                                  console.log("update category " + updatedBrand.productBrandName);
                                          }

                                    });


                            }
                    });


                }
       });

     });
  }


  function createBrandAndAddToProduct(itemPostName,itemName, itemSlug){
    Product.findOne({slug: itemPostName}, function(err, foundProduct) {
      if (err) {
          console.log(err);
      } else {
          var newCategoryItem = {
              slug:itemSlug,
              productBrandName: itemName,
              products: []
          }

         newCategoryItem.products.push(foundProduct._id);

            Brand.create(newCategoryItem, function(err, newlyCreatedBrand) {
                if (err) {

                    console.log(err);
                } else {

                   var updatingProduct = foundProduct
                    updatingProduct.productBrand.push({
                        id: newlyCreatedBrand._id,
                        brand:newlyCreatedBrand.productBrandName
                   });


                      Product.findByIdAndUpdate(foundProduct._id, updatingProduct, function(err, updatedProduct) {
                        if(err){
                          console.log(err);
                        }else{
                          console.log("Insert category " +  newlyCreatedBrand.slug);
                        }
                      });
                }
            });


        }


    });
  }
