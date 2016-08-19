var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var methodOverride = require("method-override");


//import models

var Blog = require('./models/blog.js');

mongoose.connect("mongodb://localhost/mtadb");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));


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
            res.render("index.ejs", { blogs: allBlogs});
          }
        });
});

app.post("/blogs", function(req, res){
    console.log("we are here");
    //get data from form
    var title = req.body.title;
    var image = req.body.image;
    var text = req.body.text;
    var author = req.body.author;
    console.log(image);
    //add to db
    var newBlog = {blogTitle: title, blogImage:image,blogText: text, blogAuthor:author}
    Blog.create(newBlog, function(err,newlyCreated){
      if(err){
        debugger;
        console.log(err);
      }else{
        //redirect to blogs
        res.redirect("/index")
      }
    })

});

app.get("/blogs/new", function(req,res){
    res.render("new.ejs")
});

app.get("/blogs/:id", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog ){
    if(err){
        console.log(err);
    }else{
        res.render("show" ,{blog : foundBlog})
    }
  })
});

app.get("/blogs/:id/edit", function(req, res){

  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      console.log(err);
    }else{
      res.render("edit", {blog: foundBlog});
    }
  })
});

app.put("/blog/:id", function(req, res){
console.log("test etstestesteste");
  var title = req.body.title;
  var image = req.body.image;
  var text = req.body.text;
  var author = req.body.author;
  console.log(image);
  //add to db
  var updatingBlog = {blogTitle: title, blogImage:image,blogText: text, blogAuthor:author}

  Blog.findByIdAndUpdate(req.params.id, updatingBlog, function(err, updatedBlog){
      if(err){
        console.log(err);
      }else{
        res.redirect("/blogs/"+req.params.id);
      }
  });
});

app.delete("/blog/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/blogs")
    }
  });
});



app.listen(3000, function(){
  console.log("mta-cms-prototype server has started");
});
