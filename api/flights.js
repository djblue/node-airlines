// Flights search api.
var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  Location  = require('./locations').Location;

var Flight = mongoose.model('Flight', {
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

    // handle the request assigning default to an unspecified query
    // parameters.
    } else {
        
        var query = {};
        query['departure.location'] = req.query.dep;
        query['destination.location'] = req.query.des;

    // TODO: date parsing

/*
        // Try to find a departure date parameter.
        if (!!req.query.date) {

            // Assume it is a range if it is an array.
            if (typeof req.query.date == Array) {

                if (!!req.query.date[0].match(/\d{5}-\d{2}-\d{2}/)) {
                    query['departure.date.0'] = new Date(req.query.date[0]);
                } else {
                    res.send(500, {
                        status: 500,
                        message: 'Date 1 query parameter not \'YYYY-MM-DD\'',
                        type: 'internal'
                    });
                }

                if (!!req.query.date[1].match(/\d{5}-\d{2}-\d{2}/)) {
                    query['departure.date.1'] = new Date(req.query.date[1]);
                } else {
                    res.send(500, {
                        status: 500,
                        message: 'Date 1 query parameter not \'YYYY-MM-DD\'',
                        type: 'internal'
                    });
                }

            // Search for a single date.
            } else {
                query['departure.date.0'] = req.query.date;
                query['departure.date.1'] = req.query.date;
            }


        // Default search range [Todays date - Two weeks from Today].
        } else {
            var date = new Date();   // Todays date.
            query['departure.date.0'] = date;
            date.setDate(date.getDate() + 14); // Two weeks.
            query['departure.date.1'] = date;
        }

        // Default cost range.
        if (!!req.query.cost) {
            if (typeof req.query.cost == Array) {
                query['cost.0'] = req.query.cost[0];
                query['cost.1'] = req.query.cost[1];
            }
        }
*/

        Flight.find(query)
            .populate('departure.location').limit(20)
            .exec(function (err, docs) {
                if (err) 
                    res.end(500);
                else
                    res.json(docs);
        });
    }
};

// require express app and setup the appropriate routes.
exports.setup = function (app) {
    
    app.get('/api/flights', search);

};
