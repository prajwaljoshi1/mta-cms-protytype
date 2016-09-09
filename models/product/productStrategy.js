var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductStrategySchema = new mongoose.Schema({
  productStrategyName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductStrategySchema.plugin(mongoosePaginate);

var ProductStrategy = mongoose.model("ProductStrategy", mtaProductStrategySchema);

module.exports  = ProductStrategy;
