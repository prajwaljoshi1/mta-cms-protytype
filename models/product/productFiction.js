var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductFictionSchema = new mongoose.Schema({
  slug:String,
  productFictionName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductFictionSchema.plugin(mongoosePaginate);

var ProductFiction = mongoose.model("ProductFiction", mtaProductFictionSchema);

module.exports  = ProductFiction;
