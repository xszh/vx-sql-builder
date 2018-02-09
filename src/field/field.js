const { Expr } = require('../expr');

class Field extends Expr {
  constructor(field, table) {
    super(field);
    this.table = table;
  }
  toSQL() {
    const expr = new Expr(this.expr);
    if (this.table) {
      return `${this.table.getAlias()}.${expr.toSQL()}`;
    }
    return `${expr.toSQL()}`;
  }
}

module.exports = Field;
