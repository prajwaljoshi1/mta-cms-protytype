var mongoose = require('mongoose');

var mtaBlogSchema = new mongoose.Schema({
  blogTitle: String,
  blogImage: String,
  blogText: String,
  blogAuthor:String,
  blogCreatedAt: { type: Date, default: Date.now }
})

var Blog = mongoose.model("Blog", mtaBlogSchema);

module.exports  = Blog
