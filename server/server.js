'use strict';

var http = require('http');
var express = require('express');

var app = express();
require('./express')(app);

var port = process.env.PORT || 3080;
app.listen(port);
console.log('Express server listening on port ' + port);
