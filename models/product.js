var mongoose = require('mongoose');

var mtaProductSchema = new mongoose.Schema({
  productName: String,
  productState: String,
  productPrice:String,
  productQuantity:String,
  productMainImage: String,
  productAdditionalImage01: String,
  productAdditionalImage02: String,
  productAdditionalImage03: String,
  productAdditionalDescription: String,
  productCreatedAt: { type: Date, default: Date.now },
  productCustomAttributes: Array
});

var Product = mongoose.model("Product", mtaProductSchema);

module.exports  = Product;
