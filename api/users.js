var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  auth      = require('./auth');

// Setup the use model.
var User = exports.User = mongoose.model('User', {
    admin: Boolean,
    username: String,
    password: String,
    flights: [{type: Schema.Types.ObjectId, ref: 'Flight'}]
});

exports.setup = function (app) {

    app.get('/api/user', auth.isAuthenticated, function (req, res) {
        res.json(req.user);
    });

};
