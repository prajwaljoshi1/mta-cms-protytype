var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductAuthorSchema = new mongoose.Schema({
  productAuthorName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductAuthorSchema.plugin(mongoosePaginate);

var ProductAuthor = mongoose.model("ProductAuthor", mtaProductAuthorSchema);

module.exports  = ProductAuthor;
