const LogicOp = require('./logicOp');

class And extends LogicOp {
  constructor(...conditions) {
    super('AND', ...conditions);
  }
}

module.exports = And;
