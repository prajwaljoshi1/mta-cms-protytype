var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductCategorySchema = new mongoose.Schema({
  slug:String,
  productCategoryName: { type: String, text: true },
  productCategoryAdditionalFields:Array,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductCategorySchema.plugin(mongoosePaginate);

var ProductCategory = mongoose.model("ProductCategory", mtaProductCategorySchema);

module.exports  = ProductCategory;
