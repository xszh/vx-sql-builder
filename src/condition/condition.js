const { Expr } = require('../expr');
const { Field } = require('../field');
const _ = require('lodash');
const { LogicOp } = require('../logic');
const genLogic = require('../utils/genLogic');

class Condition extends Expr {
  constructor(op, ...args) {
    let tmpOp = op;
    let tmpArgs = args;
    if (op instanceof Condition) {
      tmpOp = op.operator;
      tmpArgs = op.arguments;
    }
    super(op);
    this.operator = tmpOp;
    this.arguments = tmpArgs;
    const [left] = this.arguments;
    if (left instanceof Field) {
      this.table = left.table;
    }
    this.nextCondition = null;
  }
  baseOn(table) {
    this.table = table;
  }
  toSQL() {
    const [sleft, sright] = this.arguments;
    const left = new Expr(sleft);
    const right = new Expr(sright);
    return `${left.toSQL(true)} ${this.operator} ${right.toSQL(true)}`;
  }
}

class Equal extends Condition {
  constructor(left, right) {
    super('=', left, right);
  }
}
class NotEqual extends Condition {
  constructor(left, right) {
    super('<>', left, right);
  }
}
class Gt extends Condition {
  constructor(left, right) {
    super('>', left, right);
  }
}
class Gte extends Condition {
  constructor(left, right) {
    super('>=', left, right);
  }
}

class Lt extends Condition {
  constructor(left, right) {
    super('<', left, right);
  }
}
class Lte extends Condition {
  constructor(left, right) {
    super('<=', left, right);
  }
}

class Like extends Condition {
  constructor(left, right) {
    super('LIKE', left, right);
  }
}

class NotLike extends Condition {
  constructor(left, right) {
    super('NOT LIKE', left, right);
  }
}

class In extends Condition {
  constructor(left, ...rights) {
    let args = rights;
    if (_.isArray(rights[0])) {
      [args] = rights;
    }
    super('IN', left, args);
  }
  toSQL() {
    const left = new Expr(this.arguments[0]);
    const rights = this.arguments[1].map(right => new Expr(right));
    return `${left.toSQL(true)} IN (${rights.map(r => r.toSQL(true)).join(',')})`;
  }
}

class NotIn extends Condition {
  constructor(left, ...rights) {
    let args = rights;
    if (_.isArray(rights[0])) {
      [args] = rights;
    }
    super('NOT IN', left, args);
  }
  toSQL() {
    const left = new Expr(this.arguments[0]);
    const rights = this.arguments[1].map(right => new Expr(right));
    return `${left.toSQL(true)} IN (${rights.map(r => r.toSQL(true)).join(',')})`;
  }
}

class Between extends Condition {
  constructor(left, val1, val2) {
    super('BETWEEN', left, val1, val2);
  }
  toSQL() {
    let [left, val1, val2] = this.arguments;
    left = new Expr(left);
    val1 = new Expr(val1);
    val2 = new Expr(val2);
    return `${left.toSQL(true)} BETWEEN ${val1.toSQL(true)} AND ${val2.toSQL(true)}`;
  }
}

class NotBetween extends Condition {
  constructor(left, val1, val2) {
    super('BETWEEN', left, val1, val2);
  }
  toSQL() {
    let [left, val1, val2] = this.arguments;
    left = new Expr(left);
    val1 = new Expr(val1);
    val2 = new Expr(val2);
    return `${left.toSQL(true)} NOT BETWEEN ${val1.toSQL(true)} AND ${val2.toSQL(true)}`;
  }
}

class IsNull extends Condition {
  constructor(left) {
    super('IS NULL', left);
  }
  toSQL() {
    let [left] = this.arguments;
    left = new Expr(left);
    return `${left.toSQL(true)} IS NULL`;
  }
}

class IsNotNull extends Condition {
  constructor(left) {
    super('IS NOT NULL', left);
  }
  toSQL() {
    let [left] = this.arguments;
    left = new Expr(left);
    return `${left.toSQL(true)} IS NOT NULL`;
  }
}

genLogic(
  Condition,
  Logic =>
    function generator(condition) {
      if (condition instanceof Condition || condition instanceof LogicOp) {
        return new Logic(this, condition);
      }
      let left = condition;
      if (_.isString(condition) && this.table) {
        left = this.table.col(condition);
      }
      this.nextCondition = {
        Logic,
        left,
      };
      return this;
    },
);

const conditions = {
  Condition,
  Equal,
  NotEqual,
  Like,
  NotLike,
  In,
  NotIn,
  Between,
  NotBetween,
  Gt,
  Gte,
  Lt,
  Lte,
  IsNull,
  IsNotNull,
};

const condGenerator = Cond =>
  function generator(value) {
    if (this.nextCondition) {
      const { Logic, left } = this.nextCondition;
      this.nextCondition = null;
      return new Logic(this, new Cond(left, value));
    }
    throw new Error('Condition must follow AND/OR/NOT');
  };

const fieldCondGenerator = Cond =>
  function generator(value) {
    return new Cond(this, value);
  };
const conds = {};
const fieldConds = {};
_.each(conditions, (Cond, key) => {
  if (key !== 'Condition') {
    conds[_.camelCase(key)] = condGenerator(Cond);
    fieldConds[_.camelCase(key)] = fieldCondGenerator(Cond);
  }
});
Object.assign(Condition.prototype, conds);
Object.assign(Field.prototype, fieldConds);

module.exports = conditions;
