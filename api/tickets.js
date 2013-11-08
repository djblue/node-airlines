var mongoose = require('mongoose');

var TicketSchema = new mongoose.Schema({
    date: Date,
    from: String,
    to: String,
    purchased: Number,
    total_seats: Number
});

// register model with mongoose so it can be served
mongoose.model('Ticket', TicketSchema);
