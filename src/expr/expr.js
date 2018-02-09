const _ = require('lodash');

class Expr {
  constructor(expr) {
    this.literal = false;
    this.expr = expr;
    this.raw = '';
    if (expr instanceof Expr) {
      this.expr = expr;
      this.raw = expr.toRaw();
    } else {
      this.literal = true;
      this.raw = expr;
    }
  }
  toRaw() {
    return this.raw;
  }
  toSQL(literal = false) {
    if (literal && this.literal) {
      if (_.isString(this.expr)) {
        return `'${this.expr}'`;
      }
      return this.expr;
    } else if (!this.literal) {
      return this.expr.toSQL(literal);
    }
    return this.expr;
  }
}

module.exports = Expr;
