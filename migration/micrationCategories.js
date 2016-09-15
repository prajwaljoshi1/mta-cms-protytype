// SELECT DISTINCT
// post_name
// ,(SELECT group_concat(wp_terms.name separator ', ')
//     FROM wp_terms
//     INNER JOIN wp_term_taxonomy on wp_terms.term_id = wp_term_taxonomy.term_id
//     INNER JOIN wp_term_relationships wpr on wpr.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id
//     WHERE taxonomy= 'brand' and wp_posts.ID = wpr.object_id
// ) AS "Categories"
//
// FROM wp_posts
// WHERE post_type = 'product'



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





var importCategories = function(Modl) {
    var query = "select   DISTINCT wp_posts.post_name, wp_terms.name, wp_terms.slug from wp_terms INNER JOIN wp_term_taxonomy on wp_terms.term_id = wp_term_taxonomy.term_id INNER JOIN wp_term_relationships wpr on wpr.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id INNER JOIN wp_posts on wp_posts.ID = wpr.object_id where post_type = 'Product' AND wp_term_taxonomy.taxonomy = 'brand' limit 20"  ;

    connection.query(query, function(err, results) {


        if (err) throw err;
        var counter = 0;
        results.forEach(function(item) {
          counter = counter +1 ;
          if(counter <= 25000){
          //if(counter >= 25001  && counter <= 50000){
          //if(counter >= 50001  && counter <= 75000){
          //if(counter >= 75001 && counter <= 100000){
          //if(counter >= 100001 && counter <= 125000){

            Brand.findOne({slug: item.slug}, function(err, foundBrand) {
                if (err){
                  console.log(err);
                }
                else {
                    if (foundBrand) {

                        Product.findOne({slug: item.post_name}, function(err, product) {
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


                     } else {


                        Product.findOne({slug: item.post_name}, function(err, foundProduct) {
                          if (err) {
                              console.log(err);
                          } else {
                              var newCategoryItem = {
                                  slug:item.slug,
                                  productBrandName: item.name,
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
                                              console.log("Insert category");
                                            }
                                          });
                                    }
                                });


                            }


                        });





                    }
                }
            });

          }else{
            console.log(counter);
          }

        });


    });



};



importCategories("Brand");
