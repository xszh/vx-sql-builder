'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../expr'),
    Expr = _require.Expr,
    AliasExpr = _require.AliasExpr,
    OrderExpr = _require.OrderExpr;

var _require2 = require('../table'),
    Table = _require2.Table;

var _require3 = require('../logic'),
    LogicOp = _require3.LogicOp;

var _require4 = require('../condition'),
    Condition = _require4.Condition;

var _require5 = require('../function'),
    Func = _require5.Func;

var _ = require('lodash');
var genCondition = require('../utils/genCondition');
var genLogic = require('../utils/genLogic');

var genLogicInternal = function genLogicInternal(Logic) {
  return function generator(condition) {
    if (condition instanceof Condition) {
      this.conditions.push(Logic ? new Logic(condition) : condition);
    } else if (condition instanceof LogicOp) {
      this.conditions.push(Logic ? new Logic(condition) : condition);
    } else {
      if (this.currentCondition) {
        throw new Error('Logic must be ended by right hand side expr');
      }
      var col = condition;
      if (_.isString(condition)) col = this.table.col(col);
      this.currentCondition = {
        Logic: Logic,
        left: col
      };
    }
    return this;
  };
};

var Query = function (_AliasExpr) {
  _inherits(Query, _AliasExpr);

  function Query(query, alias) {
    _classCallCheck(this, Query);

    var _this = _possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).call(this, query, alias));

    _this.table = null;
    _this.fields = [];
    _this.conditions = [];
    _this.currentCondition = null;
    _this.groups = [];
    _this.orders = [];
    _this.pagingConfig = {
      paging: false,
      limit: 10,
      offset: 0
    };
    return _this;
  }

  _createClass(Query, [{
    key: 'from',
    value: function from(table) {
      for (var _len = arguments.length, tables = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        tables[_key - 1] = arguments[_key];
      }

      if (tables.length > 0) {
        this.table = tables.reduce(function (tb, rhs) {
          return tb.join(rhs);
        }, new Table(table));
      } else {
        this.table = new Table(table);
      }
      return this;
    }
  }, {
    key: 'join',
    value: function join() {
      var _table;

      this.table = (_table = this.table).join.apply(_table, arguments);
      return this;
    }
  }, {
    key: 'leftJoin',
    value: function leftJoin() {
      var _table2;

      this.table = (_table2 = this.table).leftJoin.apply(_table2, arguments);
      return this;
    }
  }, {
    key: 'rightJoint',
    value: function rightJoint() {
      var _table3;

      this.table = (_table3 = this.table).rightJoint.apply(_table3, arguments);
      return this;
    }
  }, {
    key: 'on',
    value: function on() {
      var _table4;

      (_table4 = this.table).on.apply(_table4, arguments);
      return this;
    }
  }, {
    key: 'assertTable',
    value: function assertTable() {
      if (!this.table) {
        throw new Error('Please define From firstly');
      }
    }
  }, {
    key: 'select',
    value: function select() {
      var _this2 = this;

      this.assertTable();

      for (var _len2 = arguments.length, fields = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        fields[_key2] = arguments[_key2];
      }

      this.fields = this.fields.concat(fields.map(function (f) {
        if (f instanceof AliasExpr) {
          return f;
        }
        var field = f;
        var alias = '';
        if (_.isArray(f)) {
          var _f = _slicedToArray(f, 2);

          field = _f[0];
          alias = _f[1];

          if (field === '*') {
            throw new Error('Star cannot have alias');
          }
        }
        if (_.isString(f) && f !== '*') {
          field = _this2.table.get(field);
        } else if (f === '*') {
          return new Expr('*');
        }
        return new AliasExpr(field, alias);
      }));
      return this;
    }
  }, {
    key: 'get',
    value: function get(name) {
      var col = _.find(this.fields, function (ae) {
        return ae.getAlias() === name;
      });
      if (col) return col.getAlias();
      throw new Error(name + ' not found');
    }
  }, {
    key: 'toFieldsSQL',
    value: function toFieldsSQL() {
      return this.fields.map(function (f) {
        return f.toSQL();
      }).join(',');
    }
  }, {
    key: 'toWhereSQL',
    value: function toWhereSQL() {
      var ret = 'WHERE';
      if (this.conditions.length > 0) {
        _.each(this.conditions, function (c) {
          ret = ret + ' ' + c.toSQL();
        });
        return ret;
      }
      return '';
    }
  }, {
    key: 'toGroupSQL',
    value: function toGroupSQL() {
      if (this.groups.length > 0) {
        return 'GROUP BY ' + this.groups.map(function (g) {
          return g.toSQL();
        }).join(', ');
      }
      return '';
    }
  }, {
    key: 'toOrderSQL',
    value: function toOrderSQL() {
      if (this.orders.length > 0) {
        var orderClause = 'ORDER BY ' + this.orders.map(function (g) {
          return g.toSQL();
        }).join(', ');
        if (this.pagingConfig.paging) {
          return orderClause + ' OFFSET ' + this.pagingConfig.offset + ' ROWS FETCH NEXT ' + this.pagingConfig.limit + ' ROWS ONLY';
        }
        return orderClause;
      }
      return '';
    }
  }, {
    key: 'toSQL',
    value: function toSQL() {
      var literal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this.assertTable();
      var ret = 'SELECT ' + this.toFieldsSQL() + ' FROM ' + this.table.toSQL() + ' ' + this.toWhereSQL() + ' ' + this.toGroupSQL() + ' ' + this.toOrderSQL();
      if (literal) return '(' + ret + ')';
      return ret;
    }
  }, {
    key: 'where',
    value: function where(condition) {
      return genLogicInternal().call(this, condition);
    }
  }, {
    key: 'group',
    value: function group() {
      var _this3 = this;

      this.assertTable();

      for (var _len3 = arguments.length, fields = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        fields[_key3] = arguments[_key3];
      }

      this.groups = this.groups.concat(fields.map(function (f) {
        var field = f;
        if (_.isString(field)) {
          field = _this3.table.get(field);
        }
        return new Expr(field);
      }));
      return this;
    }
  }, {
    key: 'order',
    value: function order() {
      var _this4 = this;

      this.assertTable();

      for (var _len4 = arguments.length, fields = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        fields[_key4] = arguments[_key4];
      }

      this.orders = this.orders.concat(fields.map(function (f) {
        var field = f[0];
        var order = f[1];
        if (_.isString(field)) {
          field = _this4.table.get(field);
        }
        return new OrderExpr(field, order);
      }));
      return this;
    }
  }, {
    key: 'asc',
    value: function asc(field) {
      return this.order([field, 'ASC']);
    }
  }, {
    key: 'desc',
    value: function desc(field) {
      return this.order([field, 'DESC']);
    }
  }, {
    key: 'paging',
    value: function paging(limit, offset) {
      this.assertTable();
      if (this.orders.length === 0) {
        throw new Error('Paging must be setup with order');
      }
      this.pagingConfig = { limit: limit, offset: offset, paging: true };
      return this;
    }

    // built-in functions

  }], [{
    key: 'count',
    value: function count(field) {
      return new Func('COUNT', field);
    }
  }]);

  return Query;
}(AliasExpr);

genCondition(Query, function (Cond) {
  return function generator(value) {
    if (this.currentCondition) {
      var _currentCondition = this.currentCondition,
          Logic = _currentCondition.Logic,
          left = _currentCondition.left;

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
  };
});

genLogic(Query, function (Logic) {
  return function generator(condition) {
    return genLogicInternal(Logic).call(this, condition);
  };
});

module.exports = Query;