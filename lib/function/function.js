'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../expr'),
    Expr = _require.Expr;

var Func = function (_Expr) {
  _inherits(Func, _Expr);

  function Func(fn) {
    _classCallCheck(this, Func);

    var _this = _possibleConstructorReturn(this, (Func.__proto__ || Object.getPrototypeOf(Func)).call(this, fn));

    _this.fn = fn;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    _this.arguments = args;
    return _this;
  }

  _createClass(Func, [{
    key: 'toSQL',
    value: function toSQL() {
      return this.fn + '(' + this.arguments.map(function (a) {
        if (a instanceof Expr) {
          return a.toSQL(true);
        }
        return new Expr(a).toSQL(true);
      }).join(',') + ')';
    }
  }]);

  return Func;
}(Expr);

module.exports = Func;