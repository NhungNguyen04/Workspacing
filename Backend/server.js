const cors = require('cors');
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3033,
    mongoose = require('mongoose'),
    Task = require('./src/models/taskModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/workspacing');
process.send = process.send || function () {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./src/routes/route');
routes(app);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });


app.use(cors());

app.listen(port);
console.log('Workspacing RESTful API server started on: ' + port);
process.send('ready');