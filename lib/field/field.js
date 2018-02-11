'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../expr'),
    Expr = _require.Expr,
    AliasExpr = _require.AliasExpr;

var Field = function (_Expr) {
  _inherits(Field, _Expr);

  function Field(field, table) {
    _classCallCheck(this, Field);

    var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, field));

    _this.table = table;
    return _this;
  }

  _createClass(Field, [{
    key: 'as',
    value: function as(alias) {
      return new AliasExpr(this, alias);
    }
  }, {
    key: 'toSQL',
    value: function toSQL() {
      var expr = new Expr(this.expr);
      if (this.table) {
        return this.table.getAlias() + '.' + expr.toSQL();
      }
      return '' + expr.toSQL();
    }
  }]);

  return Field;
}(Expr);

module.exports = Field;