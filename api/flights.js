// Flights search api.
var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  Location  = require('./locations').Location;

var Flight = exports.Flight = mongoose.model('Flight', {
    departure:  {
        date: Date,
        location: {type: Number, ref: 'Location'}
    },
    destination:  {
        date: Date,
        location: {type: Number, ref: 'Location'}
    },
    total: Number,
    available: Number,
    price: Number
});

// Create some fake data for the database.
var init = function (app) {

    if ('development' != app.get('env')) return;

    for (var i = 0; i < 10000; i++) {

        var rand1 = Math.floor(Math.random()*100);
        var rand2 = Math.floor(Math.random()*100);

        var offset = i % 14;

        var now = new Date();
        now.setDate(now.getDate() + offset);
        var next = new Date(now);
        next.setHours(now.getHours() + (rand1 % 6) + 1);

        var f = new Flight({
            departure: {
                date: now,
                location:  (rand1 % 50) + 1
            },
            destination: {
                date: next,
                location:  (rand2 % 50) + 1
            },
            price: (rand1 + rand2) % 1000,
            available: (rand2 % 250) + 1,
            total: 250
        });

        f.save();
    }

};

var search = function (req, res) {
    
    // There must be some constrains for searching flights.
    if (Object.keys(req.query).length === 0) {

        Flight.find()
            .populate('departure.location')
            .exec(function (err, docs) {
                if (err) 
                    res.json(err)
                else
                    res.json(docs);
        });

    // The two main constrains are departure and destination locations.
    } else if (!req.query.dep) {
    
        res.send(500, {
            status: 500,
            message: 'Departure \'dep\'query parameter required.',
            type: 'internal'
        });

    } else if (!req.query.des) {

        res.send(500, {
            status: 500,
            message: 'Destination \'des\' query parameter required.',
            type: 'internal'
        });

    // Handle the request assigning default to an unspecified query
    // parameters.
    } else {
        
        var query = {};
        query['departure.location'] = req.query.dep;
        query['destination.location'] = req.query.des;

        // Try to find a departure date parameter.
        if (!!req.query.date) {

            // Validate date format [YYYY-MM-DD].
            if (!req.query.date.match(/\d{5}-\d{2}-\d{2}/)) {
                query['departure.date'] = {
                    '$gte': new Date(req.query.date)
                };
            } else {
                res.send(500, {
                    status: 500,
                    message: '\'date\' query parameter not \'YYYY-MM-DD\'',
                    type: 'internal'
                });
            }
        } else { query['departure.date'] = { '$gte': new Date() }; }

        // Default cost range. [0 - cost]
        if (!!req.query.cost) {
            if (req.query.cost >= 0 || req.query.cos < 0) {
                query['price'] = {
                    '$lte': Number(req.query.cost)
                }
            } else {
                res.send(500, {
                    status: 500,
                    message: '\'cost\' query parameter not a number',
                    type: 'internal'
                });
            }
        }

        Flight.find(query)
            .populate('departure.location destination.location').limit(20)
            .exec(function (err, docs) {
                if (err) 
                    res.end(500);
                else
                    res.json(docs);
        });
    }
};

// Require express app and setup the appropriate routes.
exports.setup = function (app) {
    
    app.get('/api/flights', search);

    // Populate database with fake flights if its empty
    Flight.find({}, function (err, docs){
        if (docs.length === 0)
            init(app);
    })
    
};
