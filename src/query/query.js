const { Expr, AliasExpr, OrderExpr } = require('../expr');
const { Table } = require('../table');
const { LogicOp } = require('../logic');
const { Condition } = require('../condition');
const _ = require('lodash');
const genCondition = require('../utils/genCondition');
const genLogic = require('../utils/genLogic');

const genLogicInternal = Logic =>
  function generator(condition) {
    if (condition instanceof Condition) {
      this.conditions.push(Logic ? new Logic(condition) : condition);
    } else if (condition instanceof LogicOp) {
      this.conditions.push(Logic ? new Logic(condition) : condition);
    } else {
      if (this.currentCondition) {
        throw new Error('Logic must be ended by right hand side expr');
      }
      let col = condition;
      if (_.isString(condition)) col = this.table.col(col);
      this.currentCondition = {
        Logic,
        left: col,
      };
    }
    return this;
  };

class Query extends AliasExpr {
  constructor(query, alias) {
    super(query, alias);
    this.table = null;
    this.fields = [];
    this.conditions = [];
    this.currentCondition = null;
    this.groups = [];
    this.orders = [];
    this.pagingConfig = {
      paging: false,
      limit: 10,
      offset: 0,
    };
  }
  from(table, ...tables) {
    if (tables.length > 0) {
      this.table = tables.reduce((tb, rhs) => tb.join(rhs), new Table(table));
    } else {
      this.table = new Table(table);
    }
    return this;
  }
  assertTable() {
    if (!this.table) {
      throw new Error('Please define From firstly');
    }
  }
  select(...fields) {
    this.assertTable();
    this.fields = this.fields.concat(fields.map((f) => {
      let field = f;
      let alias = '';
      if (_.isArray(f)) {
        [field, alias] = f;
        if (field === '*') {
          throw new Error('Star cannot have alias');
        }
      }
      if (_.isString(f) && f !== '*') {
        field = this.table.get(field);
      } else if (f === '*') {
        return new Expr('*');
      }
      return new AliasExpr(field, alias);
    }));
    return this;
  }
  get(name) {
    const col = _.find(this.fields, ae => ae.getAlias() === name);
    if (col) return col.getAlias();
    throw new Error(`${name} not found`);
  }
  toFieldsSQL() {
    return this.fields.map(f => f.toSQL()).join(',');
  }
  toWhereSQL() {
    let ret = 'WHERE';
    if (this.conditions.length > 0) {
      _.each(this.conditions, (c) => {
        ret = `${ret} ${c.toSQL()}`;
      });
      return ret;
    }
    return '';
  }
  toGroupSQL() {
    if (this.groups.length > 0) {
      return `GROUP BY ${this.groups.map(g => g.toSQL()).join(', ')}`;
    }
    return '';
  }
  toOrderSQL() {
    if (this.orders.length > 0) {
      const orderClause = `ORDER BY ${this.orders.map(g => g.toSQL()).join(', ')}`;
      if (this.pagingConfig.paging) {
        return `${orderClause} OFFSET ${this.pagingConfig.offset} ROWS FETCH NEXT ${
          this.pagingConfig.limit
        } ROWS ONLY`;
      }
      return orderClause;
    }
    return '';
  }
  toSQL(literal = false) {
    this.assertTable();
    const ret = `SELECT ${this.toFieldsSQL()} FROM ${this.table.toSQL()} ${this.toWhereSQL()} ${this.toGroupSQL()} ${this.toOrderSQL()}`;
    if (literal) return `(${ret})`;
    return ret;
  }
  where(condition) {
    return genLogicInternal().call(this, condition);
  }
  group(...fields) {
    this.assertTable();
    this.groups = this.groups.concat(fields.map((f) => {
      let field = f;
      if (_.isString(field)) {
        field = this.table.get(field);
      }
      return new Expr(field);
    }));
    return this;
  }
  order(...fields) {
    this.assertTable();
    this.orders = this.orders.concat(fields.map((f) => {
      let field = f[0];
      const order = f[1];
      if (_.isString(field)) {
        field = this.table.get(field);
      }
      return new OrderExpr(field, order);
    }));
    return this;
  }
  asc(field) {
    return this.order([field, 'ASC']);
  }
  desc(field) {
    return this.order([field, 'DESC']);
  }
  paging(limit, offset) {
    this.assertTable();
    if (this.orders.length === 0) {
      throw new Error('Paging must be setup with order');
    }
    this.pagingConfig = { limit, offset, paging: true };
    return this;
  }
}

genCondition(
  Query,
  Cond =>
    function generator(value) {
      if (this.currentCondition) {
        const { Logic, left } = this.currentCondition;
        if (Logic) {
          this.conditions.push(new Logic(new Cond(left, value)));
        } else {
          this.conditions.push(new Cond(left, value));
        }
        this.currentCondition = null;
      } else {
        throw new Error('Condition must follow AND/OR/NOT');
      }
      return this;
    },
);

genLogic(
  Query,
  Logic =>
    function generator(condition) {
      return genLogicInternal(Logic).call(this, condition);
    },
);

module.exports = Query;
