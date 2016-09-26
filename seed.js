var mongoose = require("mongoose");
var User = require("./models/users");


var data = [
  {
      "_id" : ObjectId("57b69440f2d6bf6e31f552fe"),
      "salt" : "e995a6d37fd0a57a42043954ab3ef0182369d58e305d52af7dae344e919001c6",
      "hash" : "1d36fe82c9e71fb7ccb0d00220157a0e40f76011e90da6cbfc29ab21d714ec0db88282ec8b2dc1a1f9e7b08cb47b199bdf09486a3501201a4237a9d26d6c8c23b03276c7bbf8972c72701df1e672cffb32f3d95b273b69930eba0eed90f5d6192840b7e49997844adae3aae14dcec1b6def97ed6899ed422bf30fd10016ce48a156a5881b27b7ec97fd9534523abce52021cb6f407150327d186da628d58c493f069b8857ab469ea68f76c7bfcf10899e950b888f5319b3df009cbeea99647672d4a6a003207018c67a908bcb1953b0ee3de663ac5a5ed83c3000ab7aefe3811a29c3a28653e15b6c80ec45053f0fbd2e97ef624209ae4429da039219426c4a377af1049b1de7a2e7e32c2411439cb94f560cba864847a0b4ca9646bf27d47f81c4029e42948e97377f0b9cf9bfce52b34fcce89927c311cef1972daaf67a7b59ecfe27c54a94a617985081dec94e280e1e2da5ab6948956cd321fb9e45eb73b1b4935fc76fe729f4341f03fbca8a1b28d715be475a6a557e96f0ad1221c19e017748bb02bd70ed53baac286026aa8a4b95b8f0cd2daf2bbe0a82a9b123cd783606e2f5508ff9aeced6b35226bce4e1c03b1e2198b5e8948e6b2d3524c3b7a6c2002623b866b5d517856d4a94ecf550ccadb99e82d87446faeda9be565d6e3db16798a025b15e580a5bbf1d8e5e318f3e5b11e114081428f1869e8f5dd9ff2c3",
      "username" : "jake",
      "userType" : "admin",
      "__v" : 0
}
    ];

function seedDB() {
    // remove campgrounds
    User.remove({}, function(err) {
         if(err) {
             console.log(err);
       } else {
             console.log("ALL users removed!");
              add users
             data.forEach(function(seed) {
               User.create(seed, function(err, user) {
                    if(err) {
                        console.log(err);
                   } else {
                        console.log("User added!");
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
