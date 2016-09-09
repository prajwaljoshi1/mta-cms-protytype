var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductBrandSchema = new mongoose.Schema({
  productBrandName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductBrandSchema.plugin(mongoosePaginate);

var ProductBrand = mongoose.model("ProductBrand", mtaProductBrandSchema);

module.exports  = ProductBrand;
