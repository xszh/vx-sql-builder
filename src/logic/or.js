const LogicOp = require('./logicOp');

class Or extends LogicOp {
  constructor(...conditions) {
    super('OR', ...conditions);
  }
}

module.exports = Or;
