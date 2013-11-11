var mongoose = require('mongoose');

var Location = exports.Location = mongoose.model('Location', {
    _id: Number,
    city: String,
    state: String
});

// require express app and setup the appropriate routes.
exports.setup = function (app) {

    app.get('/api/locations', function (req, res) {
        Location.find({}, function (err, docs) {
            res.json(docs);
        });
    });
    
    app.get('/api/locations/:id', function (req, res) {
        Location.findById(req.params.id, function (err, docs) {
            res.json(docs);
        });
    });

};
