'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../expr'),
    Expr = _require.Expr;

var _require2 = require('../field'),
    Field = _require2.Field;

var _ = require('lodash');

var _require3 = require('../logic'),
    LogicOp = _require3.LogicOp;

var genLogic = require('../utils/genLogic');

var Condition = function (_Expr) {
  _inherits(Condition, _Expr);

  function Condition(op) {
    _classCallCheck(this, Condition);

    var tmpOp = op;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var tmpArgs = args;
    if (op instanceof Condition) {
      tmpOp = op.operator;
      tmpArgs = op.arguments;
    }

    var _this = _possibleConstructorReturn(this, (Condition.__proto__ || Object.getPrototypeOf(Condition)).call(this, op));

    _this.operator = tmpOp;
    _this.arguments = tmpArgs;

    var _this$arguments = _slicedToArray(_this.arguments, 1),
        left = _this$arguments[0];

    if (left instanceof Field) {
      _this.table = left.table;
    }
    _this.nextCondition = null;
    return _this;
  }

  _createClass(Condition, [{
    key: 'baseOn',
    value: function baseOn(table) {
      this.table = table;
    }
  }, {
    key: 'toSQL',
    value: function toSQL() {
      var _arguments = _slicedToArray(this.arguments, 2),
          sleft = _arguments[0],
          sright = _arguments[1];

      var left = new Expr(sleft);
      var right = new Expr(sright);
      return left.toSQL(true) + ' ' + this.operator + ' ' + right.toSQL(true);
    }
  }]);

  return Condition;
}(Expr);

var Equal = function (_Condition) {
  _inherits(Equal, _Condition);

  function Equal(left, right) {
    _classCallCheck(this, Equal);

    return _possibleConstructorReturn(this, (Equal.__proto__ || Object.getPrototypeOf(Equal)).call(this, '=', left, right));
  }

  return Equal;
}(Condition);

var NotEqual = function (_Condition2) {
  _inherits(NotEqual, _Condition2);

  function NotEqual(left, right) {
    _classCallCheck(this, NotEqual);

    return _possibleConstructorReturn(this, (NotEqual.__proto__ || Object.getPrototypeOf(NotEqual)).call(this, '<>', left, right));
  }

  return NotEqual;
}(Condition);

var Gt = function (_Condition3) {
  _inherits(Gt, _Condition3);

  function Gt(left, right) {
    _classCallCheck(this, Gt);

    return _possibleConstructorReturn(this, (Gt.__proto__ || Object.getPrototypeOf(Gt)).call(this, '>', left, right));
  }

  return Gt;
}(Condition);

var Gte = function (_Condition4) {
  _inherits(Gte, _Condition4);

  function Gte(left, right) {
    _classCallCheck(this, Gte);

    return _possibleConstructorReturn(this, (Gte.__proto__ || Object.getPrototypeOf(Gte)).call(this, '>=', left, right));
  }

  return Gte;
}(Condition);

var Lt = function (_Condition5) {
  _inherits(Lt, _Condition5);

  function Lt(left, right) {
    _classCallCheck(this, Lt);

    return _possibleConstructorReturn(this, (Lt.__proto__ || Object.getPrototypeOf(Lt)).call(this, '<', left, right));
  }

  return Lt;
}(Condition);

var Lte = function (_Condition6) {
  _inherits(Lte, _Condition6);

  function Lte(left, right) {
    _classCallCheck(this, Lte);

    return _possibleConstructorReturn(this, (Lte.__proto__ || Object.getPrototypeOf(Lte)).call(this, '<=', left, right));
  }

  return Lte;
}(Condition);

var Like = function (_Condition7) {
  _inherits(Like, _Condition7);

  function Like(left, right) {
    _classCallCheck(this, Like);

    return _possibleConstructorReturn(this, (Like.__proto__ || Object.getPrototypeOf(Like)).call(this, 'LIKE', left, right));
  }

  return Like;
}(Condition);

var NotLike = function (_Condition8) {
  _inherits(NotLike, _Condition8);

  function NotLike(left, right) {
    _classCallCheck(this, NotLike);

    return _possibleConstructorReturn(this, (NotLike.__proto__ || Object.getPrototypeOf(NotLike)).call(this, 'NOT LIKE', left, right));
  }

  return NotLike;
}(Condition);

var In = function (_Condition9) {
  _inherits(In, _Condition9);

  function In(left) {
    _classCallCheck(this, In);

    for (var _len2 = arguments.length, rights = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rights[_key2 - 1] = arguments[_key2];
    }

    var args = rights;
    if (_.isArray(rights[0])) {
      args = rights[0];
    }
    return _possibleConstructorReturn(this, (In.__proto__ || Object.getPrototypeOf(In)).call(this, 'IN', left, args));
  }

  _createClass(In, [{
    key: 'toSQL',
    value: function toSQL() {
      var left = new Expr(this.arguments[0]);
      var rights = this.arguments[1].map(function (right) {
        return new Expr(right);
      });
      return left.toSQL(true) + ' IN (' + rights.map(function (r) {
        return r.toSQL(true);
      }).join(',') + ')';
    }
  }]);

  return In;
}(Condition);

var NotIn = function (_Condition10) {
  _inherits(NotIn, _Condition10);

  function NotIn(left) {
    _classCallCheck(this, NotIn);

    for (var _len3 = arguments.length, rights = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      rights[_key3 - 1] = arguments[_key3];
    }

    var args = rights;
    if (_.isArray(rights[0])) {
      args = rights[0];
    }
    return _possibleConstructorReturn(this, (NotIn.__proto__ || Object.getPrototypeOf(NotIn)).call(this, 'NOT IN', left, args));
  }

  _createClass(NotIn, [{
    key: 'toSQL',
    value: function toSQL() {
      var left = new Expr(this.arguments[0]);
      var rights = this.arguments[1].map(function (right) {
        return new Expr(right);
      });
      return left.toSQL(true) + ' IN (' + rights.map(function (r) {
        return r.toSQL(true);
      }).join(',') + ')';
    }
  }]);

  return NotIn;
}(Condition);

var Between = function (_Condition11) {
  _inherits(Between, _Condition11);

  function Between(left, val1, val2) {
    _classCallCheck(this, Between);

    return _possibleConstructorReturn(this, (Between.__proto__ || Object.getPrototypeOf(Between)).call(this, 'BETWEEN', left, val1, val2));
  }

  _createClass(Between, [{
    key: 'toSQL',
    value: function toSQL() {
      var _arguments2 = _slicedToArray(this.arguments, 3),
          left = _arguments2[0],
          val1 = _arguments2[1],
          val2 = _arguments2[2];

      left = new Expr(left);
      val1 = new Expr(val1);
      val2 = new Expr(val2);
      return left.toSQL(true) + ' BETWEEN ' + val1.toSQL(true) + ' AND ' + val2.toSQL(true);
    }
  }]);

  return Between;
}(Condition);

var NotBetween = function (_Condition12) {
  _inherits(NotBetween, _Condition12);

  function NotBetween(left, val1, val2) {
    _classCallCheck(this, NotBetween);

    return _possibleConstructorReturn(this, (NotBetween.__proto__ || Object.getPrototypeOf(NotBetween)).call(this, 'BETWEEN', left, val1, val2));
  }

  _createClass(NotBetween, [{
    key: 'toSQL',
    value: function toSQL() {
      var _arguments3 = _slicedToArray(this.arguments, 3),
          left = _arguments3[0],
          val1 = _arguments3[1],
          val2 = _arguments3[2];

      left = new Expr(left);
      val1 = new Expr(val1);
      val2 = new Expr(val2);
      return left.toSQL(true) + ' NOT BETWEEN ' + val1.toSQL(true) + ' AND ' + val2.toSQL(true);
    }
  }]);

  return NotBetween;
}(Condition);

var IsNull = function (_Condition13) {
  _inherits(IsNull, _Condition13);

  function IsNull(left) {
    _classCallCheck(this, IsNull);

    return _possibleConstructorReturn(this, (IsNull.__proto__ || Object.getPrototypeOf(IsNull)).call(this, 'IS NULL', left));
  }

  _createClass(IsNull, [{
    key: 'toSQL',
    value: function toSQL() {
      var _arguments4 = _slicedToArray(this.arguments, 1),
          left = _arguments4[0];

      left = new Expr(left);
      return left.toSQL(true) + ' IS NULL';
    }
  }]);

  return IsNull;
}(Condition);

var IsNotNull = function (_Condition14) {
  _inherits(IsNotNull, _Condition14);

  function IsNotNull(left) {
    _classCallCheck(this, IsNotNull);

    return _possibleConstructorReturn(this, (IsNotNull.__proto__ || Object.getPrototypeOf(IsNotNull)).call(this, 'IS NOT NULL', left));
  }

  _createClass(IsNotNull, [{
    key: 'toSQL',
    value: function toSQL() {
      var _arguments5 = _slicedToArray(this.arguments, 1),
          left = _arguments5[0];

      left = new Expr(left);
      return left.toSQL(true) + ' IS NOT NULL';
    }
  }]);

  return IsNotNull;
}(Condition);

genLogic(Condition, function (Logic) {
  return function generator(condition) {
    if (condition instanceof Condition || condition instanceof LogicOp) {
      return new Logic(this, condition);
    }
    var left = condition;
    if (_.isString(condition) && this.table) {
      left = this.table.col(condition);
    }
    this.nextCondition = {
      Logic: Logic,
      left: left
    };
    return this;
  };
});

var conditions = {
  Condition: Condition,
  Equal: Equal,
  NotEqual: NotEqual,
  Like: Like,
  NotLike: NotLike,
  In: In,
  NotIn: NotIn,
  Between: Between,
  NotBetween: NotBetween,
  Gt: Gt,
  Gte: Gte,
  Lt: Lt,
  Lte: Lte,
  IsNull: IsNull,
  IsNotNull: IsNotNull
};

var condGenerator = function condGenerator(Cond) {
  return function generator(value) {
    if (this.nextCondition) {
      var _nextCondition = this.nextCondition,
          Logic = _nextCondition.Logic,
          left = _nextCondition.left;

      this.nextCondition = null;
      return new Logic(this, new Cond(left, value));
    }
    throw new Error('Condition must follow AND/OR/NOT');
  };
};

var fieldCondGenerator = function fieldCondGenerator(Cond) {
  return function generator(value) {
    return new Cond(this, value);
  };
};
var conds = {};
var fieldConds = {};
_.each(conditions, function (Cond, key) {
  if (key !== 'Condition') {
    conds[_.camelCase(key)] = condGenerator(Cond);
    fieldConds[_.camelCase(key)] = fieldCondGenerator(Cond);
  }
});
Object.assign(Condition.prototype, conds);
Object.assign(Field.prototype, fieldConds);

module.exports = conditions;