var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductThemeSchema = new mongoose.Schema({
  slug:String,
  productThemeName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductThemeSchema.plugin(mongoosePaginate);

var ProductTheme = mongoose.model("ProductTheme", mtaProductThemeSchema);


module.exports  = ProductTheme;
