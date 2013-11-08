var app         = require('./app').app
  , server      = require('http').createServer(app);


server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
