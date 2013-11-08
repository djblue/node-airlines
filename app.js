var util        = require('util')
  , express     = require('express')
  , app         = express()
  , path        = require('path')
  , ejs         = require('ejs')
  , mongoose    = require('mongoose')
  , mongooseApi = require('mongoose-api')

    // load api
  , tickets     = require('./api/tickets');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname+'/public/images/favicon.ico'));
app.use(express.logger('dev')); 
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '97e0089deda4f396f7e3a85c8aa62e37'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    // connect to database
    mongoose.connect('mongodb://localhost/test');
}

app.get('/path', function (req, res) {
    res.render('dynamic', {
        title: 'Request',
        style: 'request',
        production: 'production' === app.get('env'),
        main: 'request'
    });
});

mongooseApi.serveModels(app);
var db = mongoose.connection; 

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
    console.log('Database connection successful.');
});

exports.app = app;
