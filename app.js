var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/mtadb");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//schema setup

var mtaBlogSchema = new mongoose.Schema({
  blogTitle: String,
  blogImage: String
})

var Blog = mongoose.model("Blog", mtaBlogSchema);



// var blogs = [
//   {title: "TALES FROM THE ROAD", image:"http://www.child.com.au/resources/site/child/blog/blog-56-intro.jpg"},
//   {title: "LAKESHORE MAGNETIC FISHING SET", image:"http://www.child.com.au/resources/site/child/blog/blog-55-intro.jpg"},
//   {title: "SPEECH SOUNDS", image:"http://www.child.com.au/resources/site/child/blog/blog-54-intro.jpg"}
// ]

app.get("/", function(req,res){
        res.render("cmshome.ejs");
});



app.get("/blogs", function(req,res){
        Blog.find({}, function(err, allBlogs){
          if(err){
            debugger;
            console.log(err);
          }else{
            res.render("blogs.ejs", { blogs: allBlogs});
          }
        });
});

app.post("/blogs", function(req, res){
    console.log("we are here");
    //get data from form
    var title = req.body.title;
    var image = req.body.image;
    console.log(image);
    //add to db
    var newBlog = {blogTitle: title, blogImage:image}
    Blog.create(newBlog, function(err,newlyCreated){
      if(err){
        debugger;
        console.log(err);
      }else{
        //redirect to blogs
        res.redirect("/blogs")
      }
    })

});

app.get("/blogs/new", function(req,res){
    res.render("newblog.ejs")
});

app.listen(3000, function(){
  console.log("mta-cms-prototype server has started");
});
