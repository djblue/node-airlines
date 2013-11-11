var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema;

// Setup the use model.
var User = exports.User = mongoose.model('User', {
    admin: Boolean,
    name: String,
    password: String,
    flights: [{type: Schema.Types.ObjectId, ref: 'Flight'}]
});
