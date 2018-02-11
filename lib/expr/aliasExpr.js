'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Expr = require('./expr');

var AliasExpr = function (_Expr) {
  _inherits(AliasExpr, _Expr);

  function AliasExpr(expr, alias) {
    _classCallCheck(this, AliasExpr);

    var _this = _possibleConstructorReturn(this, (AliasExpr.__proto__ || Object.getPrototypeOf(AliasExpr)).call(this, expr));

    _this.alias = '';
    if (alias) {
      _this.alias = alias;
    }
    return _this;
  }

  _createClass(AliasExpr, [{
    key: 'toSQL',
    value: function toSQL() {
      if (this.alias) {
        if (!this.literal) {
          return '(' + _get(AliasExpr.prototype.__proto__ || Object.getPrototypeOf(AliasExpr.prototype), 'toSQL', this).call(this) + ') as ' + this.alias;
        }
        return _get(AliasExpr.prototype.__proto__ || Object.getPrototypeOf(AliasExpr.prototype), 'toSQL', this).call(this) + ' as ' + this.alias;
      }
      return _get(AliasExpr.prototype.__proto__ || Object.getPrototypeOf(AliasExpr.prototype), 'toSQL', this).call(this);
    }
  }, {
    key: 'getAlias',
    value: function getAlias() {
      if (this.alias) return this.alias;
      if (this.literal) return this.expr;
      return this.toRaw();
    }
  }]);

  return AliasExpr;
}(Expr);

module.exports = AliasExpr;