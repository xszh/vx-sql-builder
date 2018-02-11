'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

var Expr = function () {
  function Expr(expr) {
    _classCallCheck(this, Expr);

    this.literal = false;
    this.expr = expr;
    this.raw = '';
    if (expr instanceof Expr) {
      this.expr = expr;
      this.raw = expr.toRaw();
    } else {
      this.literal = true;
      this.raw = expr;
    }
  }

  _createClass(Expr, [{
    key: 'toRaw',
    value: function toRaw() {
      return this.raw;
    }
  }, {
    key: 'toSQL',
    value: function toSQL() {
      var literal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (literal && this.literal) {
        if (_.isString(this.expr)) {
          return '\'' + this.expr + '\'';
        }
        return this.expr;
      } else if (!this.literal) {
        return this.expr.toSQL(literal);
      }
      return this.expr;
    }
  }]);

  return Expr;
}();

module.exports = Expr;