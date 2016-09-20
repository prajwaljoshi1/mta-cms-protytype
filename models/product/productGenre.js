var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductGenreSchema = new mongoose.Schema({
  slug:String,
  productGenreName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductGenreSchema.plugin(mongoosePaginate);

var ProductGenre = mongoose.model("ProductBrand", mtaProductGenreSchema);

module.exports  = ProductGenre;
