var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  auth      = require('./auth')
 ,  Flight    = require('./flights').Flight
 ,  _         = require('underscore');

// Setup the use model.
var User = exports.User = mongoose.model('User', {
    admin: Boolean,
    username: String,
    password: String,
    flights: [{type: Schema.Types.ObjectId, ref: 'Flight'}]
});

// Allows a user to purchase a ticket.
var purchase = function (req, res) {
    
    // Check for available seats
    Flight.findOne({ _id: req.params.id, 'available': { '$gt': 0 }},     
    function (err, flight) {
        // Something went very wrong.
        if (err) {
            res.json(500, { statue: 500, 
                message: 'internal server error',
                error: err
            });
        // Darn, can't find your flight.
        } else if (!flight) {
            res.json(404, { statue: 404, 
                message: 'unable to locate flight'
            });
        } else {
            // Add flight id to user flights
            User.findByIdAndUpdate(req.user.id, {
                '$push': { 'flights': req.params.id }}, {upsert: true},
                function (err) {
                    if (err) {
                        res.json(500, { statue: 500, 
                            message: 'internal server error',
                            error: err
                        });
                    }
                }
            );
            // Update flight record
            Flight.findByIdAndUpdate(req.params.id, {
                '$inc': { 'available': -1}}, {},
                function (err) {
                    if (err) {
                        res.json(500, { statue: 500, 
                            message: 'internal server error',
                            error: err
                        });
                    } else {
                        // Return success object
                        res.json(200, { status:200, 
                            message: 'flight successfully purchased'
                        });
                    }
                }
            );
        }
    });
};

// Allows a user to cancel a ticket.
var cancel = function (req, res) {

    var find = _.find(req.user.flights, function (flight) {
        return String(req.params.id) === String(flight);
    });

    if (find === undefined) {
        res.json(404, { statue: 404, 
            message: 'flight not found',
        });
    } else {
        User.findById(req.user.id, function (err, user) {
            user.flights.remove(req.params.id);
            user.save();
        }).exec(function (err) {
            // Update flight record
            Flight.findByIdAndUpdate(req.params.id, {
                '$inc': { 'available': 1}}, {},
                function (err) {
                    if (err) {
                        res.json(500, { statue: 500, 
                            message: 'internal server error',
                            error: err
                        });
                    } else {
                        // Return success object
                        res.json(200, { status:200, 
                            message: 'flight successfully canceled'
                        });
                    }
                }
            );
        });
    }
};

exports.setup = function (app) {

    app.get('/api/user', auth.isAuthenticated, function (req, res) {
        res.json(req.user);
    });

    app.get('/api/user/flights/:id', auth.isAuthenticated, purchase);
    app.del('/api/user/flights/:id', auth.isAuthenticated, cancel);
};
