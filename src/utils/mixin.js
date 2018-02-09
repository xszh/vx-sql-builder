const _ = require('lodash');

module.exports = function mixin(source, ...targets) {
  _.each(targets, (target) => {
    Object.assign(source.prototype, target);
  });
  return source;
};
