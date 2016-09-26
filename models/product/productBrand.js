var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductBrandSchema = new mongoose.Schema({
  slug:String,
  name: { type: String, text: true },
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
