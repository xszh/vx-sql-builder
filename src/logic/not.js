const LogicOp = require('./logicOp');

class Not extends LogicOp {
  constructor(...conditions) {
    super('NOT', ...conditions);
  }
}

module.exports = Not;
