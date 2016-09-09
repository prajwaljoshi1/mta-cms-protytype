var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductSchema = new mongoose.Schema({
  productName: String,
  slug:String,
  productState: String,
  productPrice:String,
  productQuantity:String,
  productImages:Array,
  productAdditionalDescription: String,
  productCreatedAt: { type: Date, default: Date.now },
  productCustomAttributes: Array,
  productCategories: [{type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory'}],
  productBrand:Array,
    productAuthor:Array
});

mtaProductSchema.plugin(mongoosePaginate);


var Product = mongoose.model("Product", mtaProductSchema);

module.exports  = Product;
