var express = require("express");

var app = express();

app.set("view engine", "ejs");


app.get("/", function(req,res){
        res.render("cmshome");
});


app.get("/blogs", function(req,res){

      var blogs = [
        {title: "TALES FROM THE ROAD", image:"http://www.child.com.au/resources/site/child/blog/blog-56-intro.jpg"},
        {title: "LAKESHORE MAGNETIC FISHING SET", image:"http://www.child.com.au/resources/site/child/blog/blog-55-intro.jpg"},
        {title: "SPEECH SOUNDS", image:"http://www.child.com.au/resources/site/child/blog/blog-54-intro.jpg"}
      ]
        res.render("blogs", { blogs: blogs});
});

app.listen(3000, function(){
  console.log("mta-cms-prototype server has started");
});
