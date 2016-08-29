var mongoose = require('mongoose');

var mtaProductCategorySchema = new mongoose.Schema({
  productCategoryName: String,
  productCategoryAdditionalFields:Array,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});

var ProductCategory = mongoose.model("ProductCategory", mtaProductCategorySchema);

module.exports  = ProductCategory;
