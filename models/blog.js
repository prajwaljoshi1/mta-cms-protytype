var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaBlogSchema = new mongoose.Schema({
  blogTitle: String,
  blogState: String,
  blogAuthor:String,
  blogPublishedDate:String,
  blogMainImage: String,//mongoose.Schema.Types.Mixed,
  blogAdditionalImage01: String,
  blogAdditionalImage02: String,
  blogAdditionalImage03: String,
  blogContentBrief: String,
  blogContentExtended:String,
  blogTemplate:String,
  blogCreatedAt: { type: Date, default: Date.now }
});

mtaBlogSchema.plugin(mongoosePaginate);

var Blog = mongoose.model("Blog", mtaBlogSchema);

module.exports  = Blog;
