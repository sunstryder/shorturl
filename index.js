if(process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

//setup the dependencies which will be used by the business logic.

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    mongoose = require('mongoose'),
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

