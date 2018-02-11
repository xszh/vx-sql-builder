'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../expr'),
    Expr = _require.Expr,
    AliasExpr = _require.AliasExpr;

var _require2 = require('../field'),
    Field = _require2.Field,
    StarField = _require2.StarField;

var _ = require('lodash');
var JOIN_TYPES = require('../utils/joinType');

var _require3 = require('../condition'),
    Condition = _require3.Condition;

var SingleTable = function (_AliasExpr) {
  _inherits(SingleTable, _AliasExpr);

  function SingleTable(table, alias) {
    _classCallCheck(this, SingleTable);

    if (table instanceof SingleTable) {
      var _ret;

      return _ret = table, _possibleConstructorReturn(_this, _ret);
    }

    var _this = _possibleConstructorReturn(this, (SingleTable.__proto__ || Object.getPrototypeOf(SingleTable)).call(this, table, alias));

    _this.cols = [];
    return _this;
  }

  _createClass(SingleTable, [{
    key: 'add',
    value: function add(col) {
      this.cols.push(col);
    }
  }, {
    key: 'col',
    value: function col(_col) {
      if (!_.isString(_col)) throw new Error('Column name must be string');
      var found = this.cols.find(function (v) {
        return v === _col;
      });
      if (found) return new Expr(found);
      return null;
    }
  }, {
    key: 'has',
    value: function has(col) {
      return !!this.cols.find(function (v) {
        return v === col;
      });
    }
  }]);

  return SingleTable;
}(AliasExpr);

var Table = function (_Expr) {
  _inherits(Table, _Expr);

  function Table(table, alias) {
    _classCallCheck(this, Table);

    var _this2 = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, table));

    _this2.tables = [];
    if (table instanceof Table) {
      _this2.tables = table.tables;
    } else if (_.isArray(table)) {
      _this2.tables = table;
    } else {
      _this2.tables.push({
        table: new SingleTable(table, alias)
      });
    }
    _this2.joinTable = null;
    return _this2;
  }

  _createClass(Table, [{
    key: 'createJoin',
    value: function createJoin(joinType) {
      var _this3 = this;

      return function (table) {
        var rhs = new Table(table);
        rhs.tables[0].joinType = joinType;
        var newList = _this3.tables.concat(rhs.tables);
        var ret = new Table(newList);

        var _rhs$tables = _slicedToArray(rhs.tables, 1);

        ret.joinTable = _rhs$tables[0];

        return ret;
      };
    }
  }, {
    key: 'join',
    value: function join(table) {
      return this.createJoin(JOIN_TYPES.INNER_JOIN)(table);
    }
  }, {
    key: 'leftJoin',
    value: function leftJoin(table) {
      return this.createJoin(JOIN_TYPES.LEFT_OUTER_JOIN)(table);
    }
  }, {
    key: 'rightJoin',
    value: function rightJoin(table) {
      return this.createJoin(JOIN_TYPES.RIGHT_OUTER_JOIN)(table);
    }
  }, {
    key: 'on',
    value: function on(condition, rhs) {
      if (this.joinTable) {
        if (condition instanceof Condition) {
          this.joinTable.on = condition;
        } else if (typeof rhs !== 'undefined') {
          var left = condition;
          var right = rhs;
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
  }, {
    key: 'toSQL',
    value: function toSQL() {
      var it = this.tables[0];
      var lth = this.tables.length;
      var sql = it.table.toSQL();
      for (var i = 1; i < lth; i += 1) {
        var jt = this.tables[i];
        var on = jt.on ? 'ON ' + jt.on.toSQL() : '';
        sql = sql + ' ' + jt.joinType + ' ' + jt.table.toSQL() + ' ' + on;
      }
      return sql;
    }
  }, {
    key: 'add',
    value: function add(col) {
      this.root.add(col);
    }
  }, {
    key: 'col',
    value: function col(_col2) {
      this.add(_col2);
      return this.get(_col2);
    }
  }, {
    key: 'get',
    value: function get(col) {
      var _this4 = this;

      var found = [];
      _.each(this.tables, function (_ref) {
        var table = _ref.table;

        if (col === '*') {
          found.push(new StarField(table));
        } else {
          var stcol = table.col(col);
          if (stcol) {
            found.push(new Field(stcol, table));
          } else if (_this4.tables.length === 1) {
            _this4.add(col);
            found.push(new Field(table.col(col), table));
          } else {
            throw new Error(col + ' not found');
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
  }, {
    key: 'root',
    get: function get() {
      return this.tables[0].table;
    }
  }]);

  return Table;
}(Expr);

module.exports = Table;