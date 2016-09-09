var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductReadingLevelSchema = new mongoose.Schema({
  productReadingLevelName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductReadingLevelSchema.plugin(mongoosePaginate);

var ProductReadingLevel = mongoose.model("ProductReadingLevel", mtaProductReadingLevelSchema);

module.exports  = ProductReadingLevel;
