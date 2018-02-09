const { Expr } = require('../expr');

class Distinct extends Expr {
  constructor(field) {
    super('distinct');
    this.field = field;
  }
  toSQL() {
    let tmp = this.field;
    if (!(tmp instanceof Expr)) {
      tmp = new Expr(tmp);
    }
    return `DISTINCT ${tmp.toSQL(true)}`;
  }
}

module.exports = Distinct;
