
var express = require('express');
var router = express.Router();
var Blog = require("../models/blog.js");
var ProductCategory = require("../models/product/productCategory.js");
var syllable = require('syllable');
var Product = require('../models/product/product.js');
var getAllProductsSlugs = require('../components/ProductSlugs');






router.get("/productslug", function(req, res) {
    processRequest(req.params, function(err,data){
        console.log(data);
        res.json({productSlugs:data});
    });

    function processRequest(params,cb){
      getAllProductsSlugs(params,cb);
    }

});






//syllable count
router.get("/flesch-kincaid/:text", function(req, res) {

    var text = req.params.text;
    var totalSentences = text.split(/[.|!|?]\s/gi).length;
    var cleanText = text.replace( /,.?;:"'!/g, "" );
    var wordsArr = cleanText.split(' ');
    var totalWords = wordsArr.length;
    var totalSyllables = 0;
    var grade = '';

    wordsArr.forEach(function(word){
          totalSyllables = totalSyllables + syllable(word);
    });

    var score = 206.835 - 1.015 *( totalWords/totalSentences) - 84.6 * (totalSyllables/totalWords);

    if (score >= 90.0) {grade = '5th grade';}
    else if(score >= 80.0 && score < 90.0) { grade = '6th grade';}
    else if(score >= 70.0 && score < 80.0) {grade = '7th grade';}
    else if(score >= 60.0 && score < 70.0) {grade = '8th & 9th grade';}
    else if(score >= 50.0 && score < 60.0) {grade = '10th to 12th grade';}
    else if(score >= 30.0 && score < 50.0) {grade = 'college';}
    else if(score >= 0 && score < 30.0) {grade = 'college graduate';}

    score= Math.round(score)

    res.json({ grade: grade, score:score });
});


module.exports = router;
