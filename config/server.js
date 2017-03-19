var express = require('express');

var app = express();

app.use(express.static('./application/public/'));

module.exports = app;