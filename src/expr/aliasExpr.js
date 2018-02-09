const Expr = require('./expr');

class AliasExpr extends Expr {
  constructor(expr, alias) {
    super(expr);
    this.alias = '';
    if (alias) {
      this.alias = alias;
    }
  }
  toSQL() {
    if (this.alias) {
      if (!this.literal) {
        return `(${super.toSQL()}) as ${this.alias}`;
      }
      return `${super.toSQL()} as ${this.alias}`;
    }
    return super.toSQL();
  }
  getAlias() {
    if (this.alias) return this.alias;
    if (this.literal) return this.expr;
    return this.toRaw();
  }
}

module.exports = AliasExpr;
