var mysql = require('mysql2');
var express = require("express");
var fs = require('fs');
var tempStorage1= 'temp1.json';
var tempStorage2= 'temp2.json';


var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/mtadb");



var Product = require("../models/product/product.js");


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'bitnami_wordpress'
});

fs.writeFileSync(tempStorage1,'');

connection.connect();


  var query = "select  DISTINCT wp_posts.post_name, wp_terms.name, wp_terms.slug from wp_terms INNER JOIN wp_term_taxonomy on wp_terms.term_id = wp_term_taxonomy.term_id INNER JOIN wp_term_relationships wpr on wpr.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id INNER JOIN wp_posts on wp_posts.ID = wpr.object_id where post_type = 'Product' AND wp_term_taxonomy.taxonomy = 'Fiction' ORDER BY wp_terms.name ASC   ";


  connection.query(query, function(err, results) {

    if(err) throw err;

    var cList =[];
    var categoryList = [];







    results.forEach(function(item){


      var itemSlug =  item.slug;
      if(cList.indexOf(itemSlug) === -1){
          cList.push(itemSlug);



          Product.findOne({slug: item.post_name}, function(err, product) {
            if (err) {
                      console.log(err);
            } else {
              var category = { slug : '', name:'', products : []};
              category.slug = item.slug;
              category.name = item.name;


              category.products.push(product.id);

              categoryList.push(category);

              categoryListJson = JSON.stringify(categoryList)
              fs.writeFileSync(tempStorage1, categoryListJson);




            }
          });



      }else{




        Product.findOne({slug: item.post_name}, function(err, product) {
          if (err) {
                    console.log(err);
          } else {

             categoryList = JSON.parse(fs.readFileSync(tempStorage1, 'utf8'));
            fs.readFile(tempStorage1, 'utf8', function(err, contents) {

            });
            var category = categoryList.pop();
            category.products.push(product._id);
            categoryList.push(category);
             var categoryListJson = JSON.stringify(categoryList)
             console.log("productadded");
            fs.writeFileSync(tempStorage1, categoryListJson);

          }
        });





      }

    });



  });
