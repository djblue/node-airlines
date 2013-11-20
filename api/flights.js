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
    
    var query = {};     // query object for database

    var skip = 0;       // for paging purposes
    var limit = 20;     // for paging purposes

    if (!!req.query.dep && req.query.dep >= 0) {
        query['departure.location'] = Number(req.query.dep);
    }

    if (!!req.query.des && req.query.des >= 0) {
        query['destination.location'] = Number(req.query.des);
    }

    if (!!req.query.page && req.query.page >= 1) {
         skip = limit*Number(req.query.page);
    }
     
    if (!!req.query.limit && 
        req.query.limit >= 1 && req.query.limit <= 100) {
         limit = Number(req.query.limit);
    }

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
        .skip(skip)
        .limit(limit)
        .populate('departure.location destination.location')
        .exec(function (err, docs) {
            if (err) 
                res.end(500);
            else
                res.json(docs);
    });
};

var add = function (req, res) {
    var f = new Flight(req.body);
    f.save(function (err) {
        if (err) {
            res.json(500, {
                status: 500,
                message: 'unable to add flight',
                error: err
            });
        } else {
            res.json(201, {
                status: 201,
                message: 'flight successfully created'
            });
        }
    }); 
};

// Require express app and setup the appropriate routes.
exports.setup = function (app) {

    auth = require('./auth');
    
    app.get('/api/flights', search);
    app.post('/api/flights', auth.isAdmin, add);

    // Populate database with fake flights if its empty
    Flight.find({}, function (err, docs){
        if (docs.length === 0)
            init(app);
    })
    
};
