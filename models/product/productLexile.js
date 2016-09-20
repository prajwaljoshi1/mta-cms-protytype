var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductLexileSchema = new mongoose.Schema({
  slug:String,
  productLexileName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductLexileSchema.plugin(mongoosePaginate);

var ProductLexile = mongoose.model("ProductLexile", mtaProductLexileSchema);

module.exports  = ProductLexile;
