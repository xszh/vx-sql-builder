'use strict';

var Tables = require('./table');
var Querys = require('./query');
var Funcs = require('./function');
var Conditions = require('./condition');
var Exprs = require('./expr');
var Logics = require('./logic');

module.exports = Object.assign({}, Tables, Querys, Funcs, Conditions, Exprs, Logics);