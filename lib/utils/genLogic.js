'use strict';

var Logics = require('../logic');
var _ = require('lodash');

module.exports = function geLogic(source, generator) {
  var logics = {};
  _.each(Logics, function (Logic, key) {
    if (key !== 'LogicOp') {
      logics[_.camelCase(key)] = generator(Logic);
    }
  });
  Object.assign(source.prototype, logics);
};