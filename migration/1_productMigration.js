var mysql = require('mysql2');
var express = require("express");
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1/mtadb");
var Product = require("../models/product/product.js");


var postDest= 'posts.json'

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database:'bitnami_wordpress'
});


connection.connect();





var importProduct = function(){
  var query = "SELECT  * FROM wp_posts WHERE post_type='product' "; // p JOIN   wp_term_relationships TR ON p.ID=TR.object_id JOIN  wp_term_taxonomy TS  ON TR.term_taxonomy_id=T.term_taxonomy_id JOIN   wp_terms TS  ON T.term_id = TS.term_id  WHERE p.ID = c.comment_post_ID   AND c.comment_approved > 0 AND p.post_type = 'product' AND p.post_status = 'publish' AND  p.comment_count > 0 AND  T.taxonomy = 'product_cat' AND T.term_id='$term_cat'   ORDER BY ".$order_by." LIMIT 0, ". $number_of_comments; }";

  connection.query(query, function(err, results) {
    if (err) throw err;
    console.log("here we are");
    results.forEach(function(item){

      var newProduct = {
        slug:item.post_name,
        productTitle: item.post_title,
        productDescription:item.post_title,
        productImages:[],
        productAdditionalDescription: item.post_content,
        productCreatedAt: item.post_date,
        productCustomAttributes: [],
        productCategories:[],
        productBrands:[],
        productAuthors:[],
        productFiction:[],
        productGenre:[],
        productGrades:[],
        productLanguages:[],
        productLexiles:[],
        ProductSeries:[],
        productStrategies:[],
        productThemes:[],
        productYearLevels:[],
        productReadingLevels:[],
        }

        Product.create(newProduct, function(err,newlyCreated){
          if(err){
            console.log(err);
          }else{
            console.log("new product created" );
        }
      });
    })
  });

};


var importProductmeta = function(){
  var query = "select a.post_name, b.meta_key, b.meta_value  FROM wp_posts a, wp_postmeta b where a.post_type = 'Product' and b.post_id = a.ID  ";

  connection.query(query, function(err, results) {
    if (err) throw err;
    var attrObj ={};
    var attrArr=[];
    var newItem ="not";
    var oldItem="equal";
    var count = 0;
      results.forEach(function(item){
          newItem = item.post_name;
          //console.log(newItem, item.meta_value , item.meta_key );
          if(newItem !== oldItem){
            if(count !== 0) {

                updateAdditionalAttributes(oldItem,attrArr);
                console.log("loading ", count, " Products");
            }
                  oldItem = newItem;
                    attrArr = [];
                   attrArr.push({attributeName:item.meta_key , attributeValue: item.meta_value});
          }else{
            oldItem = newItem;
               attrArr.push({attributeName:item.meta_key , attributeValue: item.meta_value});
          }

             function updateAdditionalAttributes(oldItem, attrArr){
               Product.findOneAndUpdate({slug:oldItem}, { productCustomAttributes : attrArr }, function(err, doc){
                 if (err){
                   console.log("ERROR");
                 }else{
                  //console.log(attrArr.length);
                   console.log(doc);
                 }
                });

             }

              count = count +1;


    });
  });

};

//call functions
importProduct();
//importProductmeta();

connection.end();
