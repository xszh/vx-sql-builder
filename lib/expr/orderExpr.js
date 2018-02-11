'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Expr = require('./expr');

var OrderExpr = function (_Expr) {
  _inherits(OrderExpr, _Expr);

  function OrderExpr(expr, order) {
    _classCallCheck(this, OrderExpr);

    var _this = _possibleConstructorReturn(this, (OrderExpr.__proto__ || Object.getPrototypeOf(OrderExpr)).call(this, expr));

    _this.order = order;
    return _this;
  }

  _createClass(OrderExpr, [{
    key: 'toSQL',
    value: function toSQL() {
      return this.expr.toSQL() + ' ' + this.order;
    }
  }]);

  return OrderExpr;
}(Expr);

module.exports = OrderExpr;