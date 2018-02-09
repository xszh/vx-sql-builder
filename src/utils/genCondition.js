const Conditions = require('../condition');
const _ = require('lodash');

module.exports = function genCondition(source, generator) {
  const conds = {};
  _.each(Conditions, (Cond, key) => {
    if (key !== 'Condition') {
      conds[_.camelCase(key)] = generator(Cond);
    }
  });
  Object.assign(source.prototype, conds);
};
