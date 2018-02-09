const Expr = require('./expr');

class OrderExpr extends Expr {
  constructor(expr, order) {
    super(expr);
    this.order = order;
  }
  toSQL() {
    return `${this.expr.toSQL()} ${this.order}`;
  }
}

module.exports = OrderExpr;
