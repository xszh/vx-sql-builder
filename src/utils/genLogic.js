const Logics = require('../logic');
const _ = require('lodash');

module.exports = function geLogic(source, generator) {
  const logics = {};
  _.each(Logics, (Logic, key) => {
    if (key !== 'LogicOp') {
      logics[_.camelCase(key)] = generator(Logic);
    }
  });
  Object.assign(source.prototype, logics);
};
