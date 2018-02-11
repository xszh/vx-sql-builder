'use strict';

var Conditions = require('../condition');
var _ = require('lodash');

module.exports = function genCondition(source, generator) {
  var conds = {};
  _.each(Conditions, function (Cond, key) {
    if (key !== 'Condition') {
      conds[_.camelCase(key)] = generator(Cond);
    }
  });
  Object.assign(source.prototype, conds);
};