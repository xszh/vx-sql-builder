const { Expr } = require('../expr');

class LogicOp extends Expr {
  constructor(op, left, right) {
    super(op);
    this.logic = op;
    this.condition = right;
    if (typeof right === 'undefined') {
      this.condition = left;
    } else {
      this.left = left;
    }
  }
  toSQL() {
    if (!this.left) {
      return `${this.logic} ${this.condition.toSQL()}`;
    }
    return `(${this.left.toSQL()} ${this.logic} ${this.condition.toSQL()})`;
  }
}

module.exports = LogicOp;
