var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var mtaProductGradesSchema = new mongoose.Schema({
  productGradesName: String,
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


mtaProductGradesSchema.plugin(mongoosePaginate);

var ProductGrades = mongoose.model("ProductGrades", mtaProductGradesSchema);

module.exports  = ProductGrades;
