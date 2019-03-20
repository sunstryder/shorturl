if(process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

//setup the dependencies which will be used by the business logic.

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    mongoose = require('mongoose'), // this is an adapter for mongodb on node.js
    btoa = require('btoa'),
    atob = require('atob'),
    promise,
    connectionString = process.env.connectionString,
    port = process.env.PORT || 8080;

http.listen(port, function() {
    console.log('Server Started. Listening on *:' + port);
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// this is a routing handler, loads up the front end.
app.get('/', function(req, res) {
    res.sendFile('views/index.html', {
        root: __dirname
    });
});

// our first collection stores urls and their ID which is generated.
var countersSchema = new mongoose.Schema({
    _id: {type: String, required: true },
    count: {type: Number, default:0 }
});

// creates the collection using our schema above.
var Counter = mongoose.model('Counter', countersSchema);

var urlSchema = new mongoose.Schema({
    _id: { type: Number },
    url: '',
    created_at: ''
});

// this pre function defines a pre hook.
urlSchema.pre('save', function(next) {
    console.log('running pre-save process');
    var doc = this;
    Counter.findByIdAndUpdate(
        { _id: 'url_count' },
        { $inc: { count: 1 } },
        function(err, counter) {
            if(err) return next(err);
            console.log(counter);
            console.log(counter.count);
            // auto increment the counter
            doc._id = counter.count;
            // log the date and time
            doc.created_at = new Date()
            console.log(doc);
            next();
        }
    );
});

// creates the second collection which contains incrementing counter
var URL = mongoose.model('URL', urlSchema);

// this connects to our shared mongodb instance on scalegrid
promise = mongoose.connect(connectionString, {
    useMongoClient: true
});

promise.then(function(db) {
    console.log('connected successfully');
    // first param is condition, second param is callback
    URL.remove({}, function() {
        console.log('URL collection wiped');
    })
    Counter.remove({}, function() {
        console.log('Counter collection wiped');
        var counter = new Counter({ _id: 'url_count', count: 10000 });
        counter.save(function(err) {
            if(err) return console.error(err);
            console.log('counter inserted');
        });
    });
});