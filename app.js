var express = require("express");
var app = express();
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


var blogs = [
  {title: "TALES FROM THE ROAD", image:"http://www.child.com.au/resources/site/child/blog/blog-56-intro.jpg"},
  {title: "LAKESHORE MAGNETIC FISHING SET", image:"http://www.child.com.au/resources/site/child/blog/blog-55-intro.jpg"},
  {title: "SPEECH SOUNDS", image:"http://www.child.com.au/resources/site/child/blog/blog-54-intro.jpg"}
]

app.get("/", function(req,res){
        res.render("cmshome.ejs");
});



app.get("/blogs", function(req,res){


        res.render("blogs.ejs", { blogs: blogs});
});

app.post("/blogs", function(req, res){
    console.log("we are here");
    //get data from form
    var blogTitle = req.body.title;
    var blogImage = req.body.image;
    //add to db
    var newBlog = {title: blogTitle, image:blogImage}
    blogs.push(newBlog);
    //redirect to blogs

    res.redirect("/blogs");

});

app.get("/blogs/new", function(req,res){
    res.render("newblog.ejs")
});

app.listen(3000, function(){
  console.log("mta-cms-prototype server has started");
});
