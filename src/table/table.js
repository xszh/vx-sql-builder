const { Expr, AliasExpr } = require('../expr');
const { Field, StarField } = require('../field');
const _ = require('lodash');
const JOIN_TYPES = require('../utils/joinType');
const { Condition } = require('../condition');

class SingleTable extends AliasExpr {
  constructor(table, alias) {
    if (table instanceof SingleTable) {
      return table;
    }
    super(table, alias);
    this.cols = [];
  }
  add(col) {
    this.cols.push(col);
  }
  col(col) {
    if (!_.isString(col)) throw new Error('Column name must be string');
    const found = this.cols.find(v => v === col);
    if (found) return new Expr(found);
    return null;
  }
  has(col) {
    return !!this.cols.find(v => v === col);
  }
}

class Table extends Expr {
  constructor(table, alias) {
    super(table);
    this.tables = [];
    if (table instanceof Table) {
      this.tables = table.tables;
    } else if (_.isArray(table)) {
      this.tables = table;
    } else {
      this.tables.push({
        table: new SingleTable(table, alias),
      });
    }
    this.joinTable = null;
  }
  get root() {
    return this.tables[0].table;
  }
  createJoin(joinType) {
    return (table) => {
      const rhs = new Table(table);
      rhs.tables[0].joinType = joinType;
      const newList = this.tables.concat(rhs.tables);
      const ret = new Table(newList);
      [ret.joinTable] = rhs.tables;
      return ret;
    };
  }
  join(table) {
    return this.createJoin(JOIN_TYPES.INNER_JOIN)(table);
  }
  leftJoin(table) {
    return this.createJoin(JOIN_TYPES.LEFT_OUTER_JOIN)(table);
  }
  rightJoin(table) {
    return this.createJoin(JOIN_TYPES.RIGHT_OUTER_JOIN)(table);
  }
  on(condition, rhs) {
    if (this.joinTable) {
      if (condition instanceof Condition) {
        this.joinTable.on = condition;
      } else if (typeof rhs !== 'undefined') {
        let left = condition;
        let right = rhs;
        if (_.isString(left)) {
          left = this.col(left);
        }
        if (_.isString(right)) {
          right = this.col(right);
        }
        this.joinTable.on = left.equal(right);
      } else {
        this.joinTable.on = new Expr(condition);
      }
      return this;
    }
    throw new Error('ON CANNOT BE CALLED WITHOUT JOIN');
  }
  toSQL() {
    const it = this.tables[0];
    const lth = this.tables.length;
    let sql = it.table.toSQL();
    for (let i = 1; i < lth; i += 1) {
      const jt = this.tables[i];
      const on = jt.on ? `ON ${jt.on.toSQL()}` : '';
      sql = `${sql} ${jt.joinType} ${jt.table.toSQL()} ${on}`;
    }
    return sql;
  }
  add(col) {
    this.root.add(col);
  }
  col(col) {
    this.add(col);
    return this.get(col);
  }
  get(col) {
    const found = [];
    _.each(this.tables, ({ table }) => {
      if (col === '*') {
        found.push(new StarField(table));
      } else {
        const stcol = table.col(col);
        if (stcol) {
          found.push(new Field(stcol, table));
        } else if (this.tables.length === 1) {
          this.add(col);
          found.push(new Field(table.col(col), table));
        } else {
          throw new Error(`${col} not found`);
        }
      }
    });
    if (found.length === 1) {
      return found[0];
    } else if (found.length === 0) {
      return null;
    }
    return found;
  }
}

module.exports = Table;
