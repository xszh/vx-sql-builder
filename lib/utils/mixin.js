'use strict';

var _ = require('lodash');

module.exports = function mixin(source) {
  for (var _len = arguments.length, targets = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    targets[_key - 1] = arguments[_key];
  }

  _.each(targets, function (target) {
    Object.assign(source.prototype, target);
  });
  return source;
};