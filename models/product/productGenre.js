var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductGenreSchema = new mongoose.Schema({
  slug:String,
  name: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductGenreSchema.plugin(mongoosePaginate);

var ProductGenre = mongoose.model("ProductGenre", mtaProductGenreSchema);

module.exports  = ProductGenre;
