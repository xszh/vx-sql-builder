const { Expr } = require('../expr');

class Func extends Expr {
  constructor(fn, ...args) {
    super(fn);
    this.fn = fn;
    this.arguments = args;
  }
  toSQL() {
    return `${this.fn}(${this.arguments.map((a) => {
      if (a instanceof Expr) {
        return a.toSQL(true);
      }
      return (new Expr(a)).toSQL(true);
    }).join(',')})`;
  }
}

module.exports = Func;
