var mongoose = require('mongoose');

var mtaProductCategorySchema = new mongoose.Schema({
  productCategoryName: String,
  productCategoryAdditionalFields:Array,
  products:[
    type:mongoose.Schema.Types.objectId,
    ref:"Comment"
  ]
});

var ProductCategory = mongoose.model("ProductCategory", mtaProductCategorySchema);

module.exports  = ProductCategory;
