'use strict';

var express = require('express');
var fs = require('fs');
var handlebars = require('handlebars');
var indexRE = /index\.html$|^[^.]+$/i;

module.exports = function (app) {
  app.set('showStackError', true);

  app.use(express.static(__dirname + '/../dist', {index: false}));

  var indexTemplate = handlebars.compile(fs.readFileSync(require.resolve('./index.html.hbs'), 'utf8'));
  var indexHTML = indexTemplate({});

  app.get(indexRE, function (req, res) {
    res.send(indexHTML);
  });

};
