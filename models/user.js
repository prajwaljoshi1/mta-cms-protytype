var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  password:String,
  userType:{ type: String, default: "noAccess" }
});

UserSchema.plugin(mongoosePaginate);

 UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);

module.exports = User;
