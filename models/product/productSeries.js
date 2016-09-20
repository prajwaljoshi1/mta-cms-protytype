var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductSeriesSchema = new mongoose.Schema({
  slug:String,
  productSeriesName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductSeriesSchema.plugin(mongoosePaginate);

var ProductSeries = mongoose.model("ProductSeries", mtaProductSeriesSchema);

module.exports  = ProductSeries;
