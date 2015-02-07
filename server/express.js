'use strict';

var express = require('express');
var fs = require('fs');
var indexRE = /index\.html$|^[^.]+$/i;

module.exports = function (app) {
  app.set('showStackError', true);

  app.use(express.static(__dirname + '/../dist', {index: false}));

  var indexHTML = fs.readFileSync(require.resolve('./index.html'), 'utf8');

  app.get(indexRE, function (req, res) {
    res.send(indexHTML);
  });
};
